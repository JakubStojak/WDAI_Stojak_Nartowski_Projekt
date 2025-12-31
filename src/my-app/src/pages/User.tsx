import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  Stack,
  Paper,
  Card,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { axiosPrivate } from "../api/axios";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material";

const MOCK_ORDERS = [
  {
    id: 1,
    number: "#12345",
    date: "12.10.2023",
    items: ["Telefon", "Etui Skórzane"],
  },
  {
    id: 2,
    number: "#12346",
    date: "05.11.2023",
    items: ["Laptop"],
  },
  {
    id: 3,
    number: "#12348",
    date: "20.11.2023",
    items: ["Słuchawki", "Stojak na słuchawki"],
  },
  {
    id: 4,
    number: "#12349",
    date: "01.12.2023",
    items: ["Kabel USB-C", "Ładowarka", "Powerbank"],
  },
  {
    id: 5,
    number: "12350",
    date: "02.01.2024",
    items: ["Banan", "JaBŁKO"],
  },
];

const MOCK_REVIEWS = [
  {
    id: 1,
    product: "Telefon",
    text: "Telefon super",
    rating: 4,
  },
  { id: 2, product: "Laptop", text: "Fajny", rating: 5 },
  { id: 3, product: "Słuchawki", text: "Dobre wygłuszenie.", rating: 5 },
  {
    id: 4,
    product: "Myszka",
    text: "Trochę za głośno klika.",
    rating: 3,
  },
  { id: 5, product: "Klawiatura", text: "Klawisze wypadają...", rating: 1 },
];

const UserPageContainer = styled(Stack)(({ theme }) => ({
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

const SectionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  ...theme.applyStyles("dark", {
    boxShadow: "rgba(0, 0, 0, 0.5) 0px 8px 24px",
    backgroundColor: theme.palette.background.paper,
  }),
}));

function User() {
  const { auth, updateNickname, updateTheme } = useAuth();
  const navigate = useNavigate();
  const [nick, setNick] = useState(auth?.nickname || "");
  const [isSaving, setIsSaving] = useState(false);
  const [adminProductId, setAdminProductId] = useState("");
  const [isAdminSaving, setIsAdminSaving] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const themeObj = useTheme();

  useEffect(() => {
    if (!auth?.accessToken) {
      navigate("/login");
    } else {
      setNick(auth.nickname || "");
    }
  }, [auth, navigate]);

  if (!auth?.accessToken) return null;

  const handleNickChange = async () => {
    if (nick.length < 3) {
      alert("Nick jest za krótki!");
      return;
    }

    setIsSaving(true);
    try {
      await axiosPrivate.put(
        "/change-nickname",
        JSON.stringify({ nickname: nick }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      updateNickname(nick);
      alert("Nick zmieniony pomyślnie!");
    } catch (err: any) {
      console.error(err);
      alert(
        "Błąd zmiany nicku: " + (err.response?.data?.message || "Błąd serwera")
      );
      setNick(auth?.nickname || "");
    } finally {
      setIsSaving(false);
    }
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
        JSON.stringify({ id: adminProductId })
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

  const getVisibleItems = (items: any[], showAll: boolean) => {
    if (showAll) return items;
    return items.slice(0, 3);
  };

  const handleThemeChange = async () => {
    const newMode = themeObj.palette.mode === "light" ? "dark" : "light";

    updateTheme(newMode);

    try {
      await axiosPrivate.put(
        "/change-theme",
        JSON.stringify({ theme: newMode })
      );
      console.log("Zapisano:", newMode);
    } catch (err) {
      console.error("Błąd zapisu motywu", err);
    }
  };

  return (
    <UserPageContainer>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 5,
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 60,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            fontWeight="bold"
            color="primary"
            align="center"
          >
            Witaj {nick}! 👋
          </Typography>

          <Button
            variant="outlined"
            onClick={handleThemeChange}
            startIcon={<DarkModeIcon />}
            sx={{
              borderRadius: 5,
              whiteSpace: "nowrap",
              mt: { xs: 2, md: 0 },
              position: { xs: "static", md: "absolute" },
              right: { md: 0 },
              top: { md: "50%" },
              transform: { md: "translateY(-50%)" },
            }}
          >
            Zmień motyw
          </Button>
        </Box>

        <SectionPaper elevation={3} sx={{ mb: 5, maxWidth: 800, mx: "auto" }}>
          <Stack spacing={3}>
            <Box
              component="form"
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <TextField
                label="Nick"
                variant="standard"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<EditIcon />}
                onClick={handleNickChange}
                disabled={isSaving || nick === auth?.nickname}
              >
                {isSaving ? "Zapisywanie..." : "Zmień"}
              </Button>
            </Box>
            {auth.role === "admin" && (
              <>
                <Divider sx={{ my: 2 }}>PANEL ADMINISTRATORA</Divider>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    bgcolor: "rgba(255, 215, 0, 0.1)",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid gold",
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
          </Stack>
        </SectionPaper>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <ShoppingBagIcon color="primary" /> Zamówienia (
              {MOCK_ORDERS.length})
            </Typography>

            <Stack spacing={2}>
              {getVisibleItems(MOCK_ORDERS, showAllOrders).map((order) => (
                <Card key={order.id} variant="outlined">
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography fontWeight="bold" variant="body1">
                        {order.number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.date}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.primary">
                      📦 <b>Produkty:</b> {order.items.join(", ")}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {MOCK_ORDERS.length > 3 && (
                <Button
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  endIcon={
                    showAllOrders ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                  sx={{ alignSelf: "center" }}
                >
                  {showAllOrders
                    ? "Zwiń listę"
                    : `Pokaż pozostałe (${MOCK_ORDERS.length - 3})`}
                </Button>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <RateReviewIcon color="secondary" /> Opinie ({MOCK_REVIEWS.length}
              )
            </Typography>

            <Stack spacing={2}>
              {getVisibleItems(MOCK_REVIEWS, showAllReviews).map((review) => (
                <Card
                  key={review.id}
                  variant="outlined"
                  sx={{ bgcolor: "background.default" }}
                >
                  <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        fontWeight="bold"
                      >
                        {review.product}
                      </Typography>
                      <Typography variant="caption">
                        ⭐ {review.rating}/5
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      fontStyle="italic"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      "{review.text}"
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              {MOCK_REVIEWS.length > 3 && (
                <Button
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  endIcon={
                    showAllReviews ? <ExpandLessIcon /> : <ExpandMoreIcon />
                  }
                  sx={{ alignSelf: "center" }}
                >
                  {showAllReviews ? "Zwiń opinie" : `Pokaż starsze opinie`}
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </UserPageContainer>
  );
}

export default User;
