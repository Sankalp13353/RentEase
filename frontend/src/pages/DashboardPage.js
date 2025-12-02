import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.name || "User",
        email: decoded.email,
        role: decoded.role,
      });
    } catch (err) {
      navigate("/");
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
  }, [navigate]);

  const role = user.role?.toLowerCase();

  return (
    <div className="dashboard-container">
      
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>RentEase</h2>
      </nav>

      {/* CONTENT */}
      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>

        {role === "owner" ? (
          <p className="subtitle">Manage your rental properties easily.</p>
        ) : (
          <p className="subtitle">Find the perfect home for rent.</p>
        )}

        {/* OWNER DASHBOARD */}
        {role === "owner" && (
          <div className="cards-container">

            <div className="dash-card" onClick={() => navigate("/add-property")}>
              <h3>🏠 Add Property</h3>
              <p>List a new house, room, or apartment for rent.</p>
            </div>

            <div className="dash-card" onClick={() => navigate("/my-properties")}>
              <h3>📋 My Properties</h3>
              <p>View, edit, or remove properties you listed.</p>
            </div>

            <div className="dash-card" onClick={() => navigate("/tenants")}>
              <h3>🧑‍🤝‍🧑 Tenants</h3>
              <p>Track renters who booked your properties.</p>
            </div>

          </div>
        )}

        {/* TENANT DASHBOARD */}
        {role === "tenant" && (
          <div className="cards-container">

            <div className="dash-card" onClick={() => navigate("/browse-properties")}>
              <h3>🔍 Browse Properties</h3>
              <p>Search rental houses and rooms.</p>
            </div>

            <div className="dash-card" onClick={() => navigate("/my-bookings")}>
              <h3>📄 My Bookings</h3>
              <p>View properties you requested or booked.</p>
            </div>

            <div className="dash-card" onClick={() => navigate("/rent-history")}>
              <h3>🏦 Rent & Payment History</h3>
              <p>Check past rent, dues, and payments.</p>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
