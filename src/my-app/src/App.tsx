import React, { useState } from "react";
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

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");

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
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
