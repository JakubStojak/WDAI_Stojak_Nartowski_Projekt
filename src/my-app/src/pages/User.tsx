import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Stack,
  Paper,
  Card,
  CardContent,
  TextField,
  Divider,
  CircularProgress,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EditIcon from "@mui/icons-material/Edit";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import StarIcon from "@mui/icons-material/Star"; 
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { axiosPrivate } from "../api/axios";

interface UserProps {
  changeTheme: () => void;
}

const UserPageContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100%",
  margin: 0,
  padding: 0,
  position: "relative",
  display: "flex",
  flexDirection: "column",
  "&::before": {
    content: '""',
    display: "block",
    position: "fixed",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

function User({ changeTheme }: UserProps) {
  const { auth, updateNickname, updateTheme } = useAuth();
  const navigate = useNavigate();
  const themeObj = useTheme();

  const [nick, setNick] = useState(auth?.nickname || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const [adminProductId, setAdminProductId] = useState("");
  const [isAdminSaving, setIsAdminSaving] = useState(false);

  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [productNames, setProductNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          axiosPrivate.get("/my-orders"),
          axiosPrivate.get("/my-reviews"),
        ]);
        if (isMounted) {
          setOrders(ordersRes.data || []);
          setReviews(reviewsRes.data || []);
        }
      } catch (err: any) {
        console.error("Błąd:", err.response?.status);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (auth?.accessToken) fetchData();
    else navigate("/login");
    return () => {
      isMounted = false;
    };
  }, [auth, navigate]);

  useEffect(() => {
    const fetchProductNames = async () => {
      if (reviews.length === 0) return;

      const productIds = Array.from(
        new Set(reviews.map((r: any) => r.productId))
      );
      const newNames: Record<number, string> = {};

      await Promise.all(
        productIds.map(async (id) => {
          try {
            const res = await fetch(`https://dummyjson.com/products/${id}`);
            const data = await res.json();
            newNames[id] = data.title;
          } catch (error) {
            console.error(`Błąd pobierania produktu ${id}`, error);
            newNames[id] = `Produkt #${id}`;
          }
        })
      );

      setProductNames(newNames);
    };

    if (reviews.length > 0) {
      fetchProductNames();
    }
  }, [reviews]);


  const handleNickChange = async () => {
    if (nick.length < 3) return alert("Nick za krótki!");
    setIsSaving(true);
    try {
      await axiosPrivate.put("/change-nickname", { nickname: nick });
      updateNickname(nick);
      alert("Zmieniono nick!");
    } catch (err) {
      alert("Błąd zmiany");
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeToggle = () => {
    const newMode = themeObj.palette.mode === "light" ? "dark" : "light";
    updateTheme(newMode);
    changeTheme();
    axiosPrivate.put("/change-theme", { theme: newMode }).catch(() => {});
  };

  const handleProductChange = async () => {
    if (
      !adminProductId ||
      isNaN(Number(adminProductId)) ||
      Number(adminProductId) < 1 ||
      Number(adminProductId) > 100
    ) {
      alert("Podaj poprawne ID produktu (1-100)");
      return;
    }

    setIsAdminSaving(true);
    try {
      await axiosPrivate.put(
        "/product-of-month",
        JSON.stringify({ id: adminProductId }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      alert("Produkt miesiąca został zmieniony!");
      setAdminProductId("");
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zmiany produktu. Czy na pewno jesteś adminem?");
    } finally {
      setIsAdminSaving(false);
    }
  };

  if (loading)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <UserPageContainer>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        <Box sx={{ mb: 5, textAlign: "center", position: "relative" }}>
          <Typography variant="h3" fontWeight="bold" color="primary">
            Witaj, {auth?.nickname || nick}! 👋
          </Typography>
          <Button
            variant="outlined"
            onClick={handleThemeToggle}
            startIcon={<DarkModeIcon />}
            sx={{
              borderRadius: 5,
              mt: 2,
              position: { md: "absolute" },
              right: 0,
              top: 0,
            }}
          >
            Motyw
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 5,
            maxWidth: 800,
            mx: "auto",
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Punkty:{" "}
            <Typography
              component="span"
              variant="h2"
              fontWeight="900"
              color="secondary"
            >
              {orders.length * 150} 💎
            </Typography>
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <TextField
              label="Zmień Nick"
              variant="standard"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleNickChange}
              disabled={isSaving || nick === auth?.nickname}
            >
              Zapisz
            </Button>
          </Box>

          {auth?.role === "admin" && (
            <>
              <Divider sx={{ my: 4 }}>PANEL ADMINISTRATORA</Divider>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  bgcolor: "rgba(255, 215, 0, 0.1)", 
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid gold",
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <StarIcon color="warning" /> Zmień produkt miesiąca (Home)
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                  <TextField
                    hiddenLabel
                    placeholder="ID"
                    type="number"
                    variant="outlined"
                    size="small"
                    value={adminProductId}
                    onChange={(e) => setAdminProductId(e.target.value)}
                    slotProps={{ htmlInput: { min: 1, max: 100 } }}
                    sx={{ bgcolor: "background.paper" }}
                  />
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleProductChange}
                    disabled={isAdminSaving}
                  >
                    Zapisz ID
                  </Button>
                </Box>
              </Box>
            </>
          )}
        </Paper>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ShoppingBagIcon color="primary" /> Zamówienia ({orders.length})
            </Typography>
            <Stack spacing={2}>
              {orders
                .slice(0, showAllOrders ? undefined : 3)
                .map((order: any) => (
                  <Card
                    key={order.id}
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                  >
                    <CardContent>
                      <Box display="flex" justifyContent="space-between">
                        <Typography fontWeight="bold">#{order.id}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        📦{" "}
                        {order.OrderItems?.map((i: any) => i.title).join(
                          ", "
                        ) || "Brak pozycji"}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ mt: 1, color: "primary.main" }}
                      >
                        Suma: {order.totalAmount} $
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              {orders.length > 3 && (
                <Button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  sx={{ mt: 1 }}
                >
                  {showAllOrders ? "Zwiń" : "Pokaż wszystkie"}
                </Button>
              )}
            </Stack>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <RateReviewIcon color="secondary" /> Opinie ({reviews.length})
            </Typography>
            <Stack spacing={2}>
              {reviews
                .slice(0, showAllReviews ? undefined : 3)
                .map((review: any) => (
                  <Card
                    key={review.id}
                    variant="outlined"
                    sx={{ borderRadius: 3 }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="subtitle2"
                          color="primary"
                          component={Link}
                          to={`/productdetails/${review.productId}`}
                          sx={{
                            textDecoration: "none",
                            fontWeight: "bold",
                            "&:hover": { textDecoration: "underline" },
                          }}
                        >
                          {productNames[review.productId] ||
                            `Produkt ${review.productId}...`}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          ⭐ {review.rating}/5
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        fontStyle="italic"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        "{review.comment}"
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              {reviews.length > 3 && (
                <Button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  sx={{ mt: 1 }}
                >
                  {showAllReviews ? "Zwiń" : "Pokaż wszystkie"}
                </Button>
              )}
            </Stack>
          </Box>
        </Box>
      </Container>
    </UserPageContainer>
  );
}

export default User;