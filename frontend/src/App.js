import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// PAGES
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

// OWNER PAGES
import OwnerAddProperty from "./pages/OwnerAddProperty";
import OwnerMyProperties from "./pages/OwnerMyProperties";
import OwnerTenants from "./pages/OwnerTenants";
// Tenant page
import BrowseProperties from "./pages/BrowseProperties";
import PropertyDetails from "./pages/PropertyDetails";
import MyBookings from "./pages/MyBookings";



// PRIVATE ROUTE COMPONENT
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* DASHBOARD - PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />

        {/* OWNER FEATURES - PROTECTED */}
        <Route
          path="/add-property"
          element={
            <PrivateRoute>
              <OwnerAddProperty />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-properties"
          element={
            <PrivateRoute>
              <OwnerMyProperties />
            </PrivateRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <PrivateRoute>
              <OwnerTenants />
            </PrivateRoute>
          }
        />
        <Route path="/browse-properties" element={<BrowseProperties />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />



        {/* FALLBACK ROUTE */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
