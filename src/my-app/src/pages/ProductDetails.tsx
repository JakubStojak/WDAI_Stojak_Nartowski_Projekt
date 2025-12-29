import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Rating,
  Avatar,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

interface Product {
  id: number;
  title: string;
  description: string;
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

const addToCart = (product: Product) => {
  const existingCart = localStorage.getItem("cart");
  const cart: Product[] = existingCart ? JSON.parse(existingCart) : [];

  const updatedCart = [...cart, product];

  localStorage.setItem("cart", JSON.stringify(updatedCart));
  alert("Dodano do koszyka!");
};

const PageContainer = styled(Stack)(({ theme }) => ({
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

const DetailCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
  }),
}));

const ReviewCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#f5f5f5",
}));

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id || id === "id") {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();

        if (data.message) {
          console.error("API zwróciło błąd:", data.message);
          setProduct(null);
        } else {
          setProduct(data);
        }
      } catch (error) {
        console.error("Błąd połączenia:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <PageContainer alignItems="center" justifyContent="center">
        <CircularProgress />
      </PageContainer>
    );

  if (!product) {
    return (
      <PageContainer alignItems="center" justifyContent="center">
        <DetailCard sx={{ p: 4, textAlign: "center", maxWidth: 500 }}>
          <Typography variant="h5" color="error" gutterBottom>
            Nie znaleziono produktu!
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Próbowano pobrać ID: <strong>{id}</strong>
          </Typography>
          <Button variant="contained" component={Link} to="/products">
            Powrót do listy
          </Button>
        </DetailCard>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/products"
            color="inherit"
          >
            Wróć do produktów
          </Button>
        </Box>

        <DetailCard>
          <Grid container>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "background.default",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "center",
                    mb: 3,
                  }}
                >
                  <CardMedia
                    component="img"
                    src={product.thumbnail}
                    alt={product.title}
                    sx={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
                  />
                </Paper>

                <Box mt="auto">
                  <Typography
                    variant="h4"
                    color="primary"
                    fontWeight="bold"
                    gutterBottom
                  >
                    ${product.price}
                  </Typography>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<AddShoppingCartIcon />}
                    onClick={() => addToCart(product)}
                    sx={{ py: 1.5, fontSize: "1.1rem" }}
                  >
                    Dodaj do koszyka
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography
                  variant="h4"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                >
                  {product.title}
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Opis produktu:
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  paragraph
                  sx={{ lineHeight: 1.8 }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ mt: 5 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    Opinie ({product.reviews?.length || 0})
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review: Review, index: number) => (
                      <ReviewCard key={`review-${index}`} elevation={0}>
                        <Stack
                          direction="row"
                          spacing={2}
                          alignItems="flex-start"
                        >
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {review.reviewerName.charAt(0)}
                          </Avatar>
                          <Box flexGrow={1}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography fontWeight="bold">
                                {review.reviewerName}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(review.date).toLocaleDateString()}
                              </Typography>
                            </Stack>

                            <Rating
                              value={review.rating}
                              readOnly
                              size="small"
                              sx={{ my: 0.5 }}
                            />

                            <Typography variant="body2" sx={{ mt: 1 }}>
                              "{review.comment}"
                            </Typography>
                          </Box>
                        </Stack>
                      </ReviewCard>
                    ))
                  ) : (
                    <Typography fontStyle="italic" color="text.secondary">
                      Brak opinii dla tego produktu.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </DetailCard>
      </Container>
    </PageContainer>
  );
}

export default ProductDetails;
