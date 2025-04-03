import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// Import useAuth hook (assuming you have an AuthContext)
import { useAuth } from "./context/AuthContext";

// Import all pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";

// Import components
import Header from "./components/Header";

// Theme Configuration
const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#d81b60" },
    success: { main: "#43a047" },
    warning: { main: "#ffa726" },
    error: { main: "#e53935" },
  },
  typography: { fontFamily: "Arial, sans-serif" },
});

// 🔐 Protected Route Component
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// 🏠 Main Layout Component (Includes Header + Pages)
const MainLayout = () => (
  <>
    <Header />
    <div className="container" style={{ padding: "20px" }}>
      <Outlet />
    </div>
  </>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* 🌟 Landing Page Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes with Header */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
