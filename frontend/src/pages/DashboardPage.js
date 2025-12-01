import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect to home if not logged in
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser({
        id: decoded.id,
        name: decoded.name || "User",
        email: decoded.email,
        role: decoded.role?.toLowerCase(), // normalize role
      });
    } catch (err) {
      navigate("/"); // invalid token
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);
  }, [navigate]);

  if (!user) return null; // render nothing while loading

  return (
    <div className="dashboard-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <h2>RentEasy</h2>
      </nav>

      {/* DASHBOARD CONTENT */}
      <div className="dashboard-content">
        <h1>Welcome {user.name}</h1>
        <p className="subtitle">
          {user.role === "owner"
            ? "Manage your rental properties easily."
            : "Find the perfect home for rent."}
        </p>

        {/* OWNER DASHBOARD */}
        {user.role === "owner" && (
          <div className="cards-container">
            <DashboardCard
              title="🏠 Add Property"
              description="List a new house, room, or apartment for rent."
              onClick={() => navigate("/add-property")}
            />
            <DashboardCard
              title="📋 My Properties"
              description="View, edit, or remove properties you listed."
              onClick={() => navigate("/my-properties")}
            />
            <DashboardCard
              title="🧑‍🤝‍🧑 Tenants"
              description="Track renters who booked your properties."
              onClick={() => navigate("/tenants")}
            />
          </div>
        )}

        {/* TENANT DASHBOARD */}
        {user.role === "tenant" && (
          <div className="cards-container">
            <DashboardCard
              title="🔍 Browse Properties"
              description="Search rental houses and rooms."
              onClick={() => navigate("/browse-properties")}
            />
            <DashboardCard
              title="📄 My Bookings"
              description="View properties you requested or booked."
              onClick={() => navigate("/my-bookings")}
            />
            <DashboardCard
              title="🏦 Rent & Payment History"
              description="Check past rent, dues, and payments."
              onClick={() => navigate("/rent-history")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable dashboard card component
const DashboardCard = ({ title, description, onClick }) => (
  <div className="dash-card" onClick={onClick}>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default DashboardPage;
