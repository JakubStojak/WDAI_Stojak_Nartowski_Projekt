require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sequelize = require("./database");
const User = require("./models/User");
const RefreshToken = require("./models/RefreshToken");
const Setting = require("./models/Setting");
const CartItem = require("./models/CartItem");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const Review = require("./models/Review");

const app = express();
app.use((req, res, next) => {
  console.log(`Zapytanie do: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  await RefreshToken.create({
    token: token,
    UserId: user.id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: "strict",
  };
  res.cookie("refreshToken", token, cookieOptions);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const createDefaultAdmins = async () => {
  const admins = [
    { email: "prowadzacy@admin.com", nick: "Prowadzący" },
    { email: "kuba@admin.com", nick: "Kuba" },
    { email: "adam@admin.com", nick: "Adam" },
  ];

  for (const adminData of admins) {
    const exists = await User.findOne({ where: { email: adminData.email } });
    if (!exists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        email: adminData.email,
        password: hashedPassword,
        nickname: adminData.nick,
        role: "admin",
      });
      console.log(`Utworzono admina: ${adminData.nick}`);
    }
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Wymagane uprawnienia administratora" });
  }
};

User.hasMany(CartItem);
CartItem.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Order.hasMany(OrderItem);
OrderItem.belongsTo(Order);

User.hasMany(Review);
Review.belongsTo(User);

app.post("/api/register", async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email zajęty" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashedPassword, nickname });

    res.status(201).json({ message: "Użytkownik utworzony" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Błędny email lub hasło" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip);

    setTokenCookie(res, refreshToken);

    res.json({
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      preference_theme: user.preference_theme,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/refresh-token", async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) return res.status(401).json({ message: "Brak tokenu" });

  try {
    const oldRefreshToken = await RefreshToken.findOne({ where: { token } });

    if (!oldRefreshToken || oldRefreshToken.revokedAt) {
      return res.status(401).json({ message: "Nieprawidłowy token" });
    }

    if (Date.now() >= oldRefreshToken.expiresAt) {
      await oldRefreshToken.destroy();
      return res.status(401).json({ message: "Token wygasł" });
    }

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findByPk(oldRefreshToken.UserId);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    oldRefreshToken.revokedAt = new Date();
    oldRefreshToken.replacedByToken = newRefreshToken;
    await oldRefreshToken.save();

    setTokenCookie(res, newRefreshToken);

    res.json({
      accessToken: newAccessToken,
      id: user.id,
      email: user.email,
      role: user.role,
      nickname: user.nickname,
      preference_theme: user.preference_theme || "light",
    });
  } catch (error) {
    return res.status(401).json({ message: "Błąd weryfikacji tokenu" });
  }
});

app.post("/api/logout", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await RefreshToken.update({ revokedAt: new Date() }, { where: { token } });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Wylogowano" });
});

app.put("/api/change-nickname", authenticateToken, async (req, res) => {
  try {
    const { nickname } = req.body;
    const userId = req.user.id;

    if (!nickname || nickname.length < 3) {
      return res.status(400).json({ message: "Nick musi mieć min. 3 znaki" });
    }

    await User.update({ nickname }, { where: { id: userId } });

    res.json({ message: "Nick zmieniony pomyślnie", nickname });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/product-of-month", async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: { key: "product_month_id" },
    });
    const id = setting ? setting.value : null;
    res.json({ id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put(
  "/api/product-of-month",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.body;
      if (!id || isNaN(id) || id < 1 || id > 100) {
        return res
          .status(400)
          .json({ message: "ID musi być liczbą od 1 do 100" });
      }

      const [setting, created] = await Setting.findOrCreate({
        where: { key: "product_month_id" },
        defaults: { value: id.toString() },
      });

      if (!created) {
        setting.value = id.toString();
        await setting.save();
      }

      res.json({ message: "Zaktualizowano produkt miesiąca", id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

app.put("/api/change-theme", authenticateToken, async (req, res) => {
  try {
    const { theme } = req.body;
    const userId = req.user.id;

    await User.update({ preference_theme: theme }, { where: { id: userId } });

    res.json({ message: "Motyw zapisany", theme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/cart", authenticateToken, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { UserId: req.user.id },
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/cart", authenticateToken, async (req, res) => {
  try {
    const { product, quantity } = req.body; 
    const userId = req.user.id;
    
    const qtyToAdd = quantity && quantity > 0 ? parseInt(quantity) : 1;

    let cartItem = await CartItem.findOne({
      where: { UserId: userId, productId: product.id },
    });

    if (cartItem) {
      cartItem.quantity += qtyToAdd;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        UserId: userId,
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: qtyToAdd,
      });
    }

    res.json({ message: "Dodano do koszyka", item: cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/cart/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; 
    const { quantity } = req.body;
    const userId = req.user.id;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Ilość musi być większa od 0" });
    }

    const cartItem = await CartItem.findOne({
      where: { id: id, UserId: userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Produkt nie znaleziony w koszyku" });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    res.json({ message: "Zaktualizowano ilość", item: cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/cart/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deleted = await CartItem.destroy({
      where: { 
        id: id, 
        UserId: userId 
      }
    });

    if (deleted) {
      res.json({ message: "Produkt usunięty z koszyka" });
    } else {
      res.status(404).json({ message: "Produkt nie znaleziony" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/cart", authenticateToken, async (req, res) => {
  try {
    await CartItem.destroy({ where: { UserId: req.user.id } });
    res.json({ message: "Koszyk wyczyszczony" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/orders", authenticateToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;

    const cartItems = await CartItem.findAll({
      where: { UserId: userId },
      transaction,
    });

    if (cartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: "Koszyk jest pusty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const newOrder = await Order.create(
      {
        UserId: userId,
        totalAmount: totalAmount,
        status: "completed",
      },
      { transaction }
    );

    const orderItemsData = cartItems.map((item) => ({
      OrderId: newOrder.id,
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      thumbnail: item.thumbnail,
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });

    await CartItem.destroy({
      where: { UserId: userId },
      transaction,
    });

    await transaction.commit();

    res
      .status(201)
      .json({ message: "Zamówienie złożone pomyślnie", orderId: newOrder.id });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/reviews", authenticateToken, async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const productIdInt = parseInt(productId);

    const existingReview = await Review.findOne({
      where: { UserId: userId, productId: productIdInt },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "Już dodałeś opinię do tego produktu." });
    }

    const review = await Review.create({
      UserId: userId,
      productId: productIdInt,
      rating,
      comment,
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ["nickname"] }],
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const productIdInt = parseInt(productId);

    const reviews = await Review.findAll({
      where: { productId: productIdInt },
      include: [{ model: User, attributes: ["nickname"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const router = express.Router();

router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [OrderItem],
      order: [["createdAt", "DESC"]],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-reviews", authenticateToken, async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { UserId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use("/api", router);

sequelize.sync({ force: false }).then(async () => {
  await createDefaultAdmins();
  console.log("Baza danych zsynchronizowana.");
  app.listen(process.env.PORT, () => {
    console.log(`Serwer działa na porcie ${process.env.PORT}`);
  });
});
