import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/onboarding/WelcomePage";
import CreateAccountPage from "./pages/auth/CreateAccountPage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/auth/register" element={<CreateAccountPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

export default App;
