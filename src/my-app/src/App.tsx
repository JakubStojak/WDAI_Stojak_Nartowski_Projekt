import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  PaletteMode,
} from "@mui/material";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import User from "./pages/User";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.preference_theme) {
      setMode(auth.preference_theme as PaletteMode);
    } else {
      setMode("light");
    }
  }, [auth]);

  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });

  const changeTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />

        <div style={{ padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={<User changeTheme={changeTheme} />} />
            <Route path="/products/:cat" element={<Products />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
