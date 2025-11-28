import React, { useEffect, useState } from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth"); 
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">🏠 RentEase</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#features">Features</a></li>
        </ul>

        <div className="auth-buttons">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => navigate("/auth")}>Login</button>
              <button className="signup-btn" onClick={() => navigate("/auth")}>Signup</button>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Home with RentEase</h1>
          <p>A trusted platform for tenants and property owners — connect directly, without brokers or hassle.</p>

          {!user && (
            <button className="cta-btn" onClick={() => navigate("/auth")}>
              Get Started
            </button>
          )}
        </div>
      </section>

      {user && (
        <section className="profile-section">
          <h2>Your Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </section>
      )}

      <section id="about" className="about-section">
        <h2>About RentEase</h2>
        <p>RentEase is your one-stop solution to find verified rental properties without intermediaries.
          Whether you're a tenant searching for the right home or an owner listing your property,
          we make the process transparent and easy.
        </p>
      </section>

      <section id="features" className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔐 Secure Login</h3>
            <p>Role-based access for Owners and Tenants using JWT authentication.</p>
          </div>
          <div className="feature-card">
            <h3>🏡 Property Listings</h3>
            <p>Owners can list and manage their rental properties with images and details.</p>
          </div>
          <div className="feature-card">
            <h3>🔍 Smart Search</h3>
            <p>Tenants can search, filter, and sort listings based on preferences.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} RentEase. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
