import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/onboarding/WelcomePage";
import CreateAccountPage from "./pages/auth/CreateAccountPage";
import LoginPage from "./pages/auth/LoginPage";
import ShopPage from "./pages/shop/ShopPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth/register" element={<CreateAccountPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
