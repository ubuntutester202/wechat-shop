import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout";

// 使用 React.lazy 进行懒加载
const WelcomePage = React.lazy(() => import("./pages/onboarding/WelcomePage"));
const CreateAccountPage = React.lazy(() => import("./pages/auth/CreateAccountPage"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const ShopPage = React.lazy(() => import("./pages/shop/ShopPage"));
const SearchResultPage = React.lazy(() => import("./pages/search/SearchResultPage"));
const ProductDetailPage = React.lazy(() => import("./pages/product/ProductDetailPage"));
const CartPage = React.lazy(() => import("./pages/cart/CartPage"));
const ProfilePage = React.lazy(() => import("./pages/profile/ProfilePage"));
const MessagePage = React.lazy(() => import("./pages/message/MessagePage"));

// 加载中组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Welcome页面不使用Layout */}
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/auth/register" element={<CreateAccountPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          
          {/* 主要页面使用Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="shop" element={<ShopPage />} />
            <Route path="search" element={<SearchResultPage />} />
            <Route path="product/:id" element={<ProductDetailPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="message" element={<MessagePage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
