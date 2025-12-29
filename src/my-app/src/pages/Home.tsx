import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  Box,
  Stack,
  Paper,
} from "@mui/material";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";

const HomeContainer = styled(Stack)(({ theme }) => ({
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

const categoryMap: Record<string, string> = {
  Piękno: "beauty",
  Meble: "furniture",
  Żywność: "groceries",
};

const ProductCard = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  maxWidth: 500,
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

function Home() {
  const id = 39;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();

      if (data.id) {
        setProduct(data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const categories = ["Piękno", "Meble", "Żywność"];

  if (loading)
    return (
      <HomeContainer alignItems="center" justifyContent="center">
        <CircularProgress />
      </HomeContainer>
    );

  return (
    <HomeContainer>
      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", color: "primary.main" }}
          >
            Witaj w sklepie
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Zapraszamy do zakupów!
          </Typography>
        </Box>

        <Box
          sx={{
            my: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
            ⭐ Produkt miesiąca
          </Typography>

          {product ? (
            <ProductCard>
              <CardMedia
                component="img"
                height="300"
                image={product.thumbnail}
                alt={product.title}
                sx={{
                  objectFit: "contain",
                  padding: 2,
                  backgroundColor: "transparent",
                }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="div"
                  fontWeight="bold"
                >
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
                  Cena: {product.price} $
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  size="large"
                  component={Link}
                  to={`/productdetails/${product.id}`}
                  fullWidth
                  variant="contained"
                >
                  Zobacz szczegóły
                </Button>
              </CardActions>
            </ProductCard>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: "center",
                backgroundColor: "rgba(255, 0, 0, 0.05)",
                border: "1px dashed red",
                maxWidth: 500,
                width: "100%",
              }}
            >
              <Typography variant="h6" color="error" gutterBottom>
                Nie udało się załadować produktu miesiąca.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Przepraszamy za utrudnienia. Sprawdź inne nasze oferty.
              </Typography>
              <Button
                component={Link}
                to="/products"
                variant="outlined"
                color="primary"
              >
                Przejdź do wszystkich produktów
              </Button>
            </Paper>
          )}
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ mt: 5, textAlign: "center" }}
        >
          Kategorie:
        </Typography>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          {categories.map((catName, index) => (
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
      </Container>
    </HomeContainer>
  );
}

export default Home;
