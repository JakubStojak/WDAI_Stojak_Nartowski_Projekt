import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Stack,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
import { axiosPrivate } from "../api/axios";

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  reviews: Review[];
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

const categoryMap: Record<string, string> = {
  Piękno: "beauty",
  Meble: "furniture",
  Żywność: "groceries",
};

const ProductsPageContainer = styled(Stack)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const ProductCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  transition: "transform 0.2s ease-in-out",
  "&:hover": { transform: "translateY(-5px)" },
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
  }),
}));

const SingleProductCard = ({ product }: { product: Product }) => {
  const { auth } = useAuth();
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = async () => {
    if (!auth?.accessToken) {
      alert("Musisz być zalogowany, aby dodać produkt do koszyka!");
      return;
    }

    try {
      await axiosPrivate.post("/cart", { product, quantity });
      alert(`Dodano do koszyka! Ilość: ${quantity}`);
    } catch (error) {
      console.error(error);
      alert("Błąd podczas dodawania.");
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
      <ProductCard variant="outlined">
        <CardMedia
          component="img"
          height="200"
          image={product.thumbnail}
          alt={product.title}
          sx={{ objectFit: "contain", p: 2, bgcolor: "transparent" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" fontWeight="bold" noWrap>
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
          >
            {product.description}
          </Typography>
          <Typography
            variant="h6"
            color="secondary"
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            {product.price} $
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            component={Link}
            to={`/productdetails/${product.id}`}
            sx={{ flex: 1 }}
          >
            Szczegóły
          </Button>

          <TextField
            type="number"
            size="small"
            label="Ilość"
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (val > 0) setQuantity(val);
            }}
            slotProps={{
              htmlInput: { min: 1, style: { textAlign: "center" } },
            }}
            sx={{ width: 60 }}
          />
        </CardActions>

        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={handleAddToCart}
          sx={{ minWidth: "auto" }}
        >
          Dodaj
        </Button>
      </ProductCard>
    </Grid>
  );
};

function Products() {
  const { cat } = useParams<{ cat: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://dummyjson.com/products?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Błąd pobierania:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ProductsPageContainer alignItems="center" justifyContent="center">
        <CircularProgress />
      </ProductsPageContainer>
    );
  }

  const filteredProducts = products.filter((p) => {
    let matchesCategory = true;
    if (cat) {
      const englishCat = categoryMap[cat as keyof typeof categoryMap];
      const targetCat = (englishCat || cat).toLowerCase();
      matchesCategory = p.category.toLowerCase() === targetCat;
    }

    const matchesSearch = p.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <ProductsPageContainer>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Nasze Produkty 🛍️
          </Typography>

          <Box sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
            <TextField
              fullWidth
              label="Szukaj produktu..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Np. mascara, sofa, apple..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: "background.paper", borderRadius: 1 }}
            />
          </Box>

          {cat !== undefined ? (
            <Box>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Kategoria: <strong>{cat}</strong>
              </Typography>
              <Button
                variant="text"
                component={Link}
                to="/products"
                color="secondary"
                sx={{ fontWeight: "bold" }}
              >
                ← Wróć do wszystkich kategorii
              </Button>
            </Box>
          ) : (
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
              {["Piękno", "Meble", "Żywność"].map((catName, index) => (
                <Grid key={index} size={{ xs: 12, sm: 4 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component={Link}
                    to={`/products/${catName}`}
                    sx={{
                      height: 50,
                      bgcolor: "white",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    {catName}
                  </Button>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Grid container spacing={4}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <SingleProductCard key={product.id} product={product} />
            ))
          ) : (
            <Grid size={{ xs: 12 }} sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nie znaleziono produktów pasujących do "{searchTerm}" 😔
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
    </ProductsPageContainer>
  );
}

export default Products;
