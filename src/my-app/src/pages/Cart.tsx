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
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useAuth } from "../context/AuthContext";
import { axiosPrivate } from "../api/axios";

interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

const CartPageContainer = styled(Stack)(({ theme }) => ({
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

const CartItemCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
  }),
}));

const SummaryCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  position: "sticky",
  top: 20,
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
  }),
}));

function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const { auth } = useAuth();

  const fetchCart = async () => {
    if (!auth?.accessToken) return;

    try {
      const response = await axiosPrivate.get("/cart");
      setItems(response.data);
    } catch (error) {
      console.error("Błąd pobierania koszyka", error);
    }
  };

  useEffect(() => {
    if (auth?.accessToken) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [auth]);
  const handleCheckout = async () => {
    if (!auth?.accessToken) return;

    try {
      await axiosPrivate.post("/orders");

      alert("Dziękujemy! Twoje zamówienie zostało złożone pomyślnie.");

      setItems([]);
    } catch (error) {
      console.error("Błąd składania zamówienia", error);
      alert(
        "Wystąpił błąd podczas przetwarzania zamówienia. Spróbuj ponownie."
      );
    }
  };

  const clearCart = async () => {
    if (!auth?.accessToken) return;

    try {
      await axiosPrivate.delete("/cart");
      setItems([]);
      alert("Koszyk wyczyszczony!");
    } catch (error) {
      console.error("Błąd czyszczenia", error);
    }
  };

  const totalSum = items
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (!auth?.accessToken) {
    return (
      <CartPageContainer>
        <Container maxWidth="md">
          <Card variant="outlined" sx={{ p: 5, textAlign: "center", mt: 5 }}>
            <Typography variant="h5" gutterBottom>
              Dostęp tylko dla zalogowanych
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Musisz się zalogować, aby zobaczyć swój koszyk.
            </Typography>
            <Button variant="contained" component={Link} to="/login">
              Zaloguj się
            </Button>
          </Card>
        </Container>
      </CartPageContainer>
    );
  }

  return (
    <CartPageContainer>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4, display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            component={Link}
            to="/products"
            color="inherit"
          >
            Wróć do produktów
          </Button>
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="primary"
          >
            Twój Koszyk 🛒
          </Typography>
        </Box>

        {items.length === 0 ? (
          <Card
            variant="outlined"
            sx={{ p: 5, textAlign: "center", bgcolor: "transparent" }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Twój koszyk jest pusty. 😔
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              component={Link}
              to="/products"
            >
              Zacznij zakupy
            </Button>
          </Card>
        ) : (
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 8 }}>
              {items.map((item) => (
                <CartItemCard key={item.id}>
                  <CardMedia
                    component="img"
                    sx={{ width: 100, height: 100, objectFit: "contain", p: 1 }}
                    image={item.thumbnail}
                    alt={item.title}
                  />

                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      px: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ilość: {item.quantity} szt.
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      color="secondary"
                      fontWeight="bold"
                      sx={{ minWidth: 100, textAlign: "right" }}
                    >
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </CardContent>
                </CartItemCard>
              ))}
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <SummaryCard>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Podsumowanie
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={3}
                >
                  <Typography variant="h6">Suma całkowita:</Typography>
                  <Typography variant="h4" color="primary" fontWeight="bold">
                    ${totalSum}
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingCartCheckoutIcon />}
                    onClick={handleCheckout}
                  >
                    Kupuję i płacę
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteSweepIcon />}
                    onClick={clearCart}
                  >
                    Wyczyść koszyk
                  </Button>
                </Stack>
              </SummaryCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </CartPageContainer>
  );
}

export default Cart;
