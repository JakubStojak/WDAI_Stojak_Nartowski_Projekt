import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "@mui/material";
import { styled } from "@mui/material/styles";

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
  "&:hover": {
    transform: "translateY(-5px)",
  },
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
  }),
}));

function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://dummyjson.com/products")
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

  return (
    <ProductsPageContainer>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            Nasze Produkty 🛍️
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <ProductCard variant="outlined">
                <CardMedia
                  component="img"
                  height="200"
                  image={product.thumbnail}
                  alt={product.title}
                  sx={{ objectFit: "contain", p: 2, bgcolor: "transparent" }}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    fontWeight="bold"
                    noWrap
                  >
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

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to={`/productdetails/${product.id}`}
                  >
                    Szczegóły
                  </Button>
                </CardActions>
              </ProductCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ProductsPageContainer>
  );
}

export default Products;
