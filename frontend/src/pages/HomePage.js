import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import "./HomePage.css";

// ❗ Do NOT change this as per your request
import ProfileCard from "/Users/sankalp/Desktop/FinalRent/frontend/src/pages/ProfileCard.js";

export default function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const [theme, setTheme] = useState("light");
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        setUser(jwtDecode(token));
      } catch {}
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenu(false);
  };

  // ✅ FIXED LOGIC (Redirect both roles to dashboard)
  const handleGetStarted = () => {
    if (!user) {
      navigate("/signup");
      return;
    }

    navigate("/dashboard"); // ⭐ Always go to dashboard
  };

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="nav">
        <h1 className="logo">RentEasy</h1>

        <div className="nav-right">
          {!user ? (
            <>
              <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
              <button onClick={() => navigate("/signup")} className="nav-btn filled">Sign Up</button>
            </>
          ) : (
            <div className="user-box">
              <FaUserCircle
                onClick={() => setMenu(!menu)}
                className="user-icon"
              />

              {menu && (
                <div className="nav-menu">

                  {/* OPEN PROFILE MODAL */}
                  <p
                    onClick={() => {
                      setOpenProfile(true);
                      setMenu(false);
                    }}
                  >
                    <FaUser /> Profile
                  </p>

                  {/* THEME SWITCH */}
                  <p onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                    {theme === "light" ? " Dark Mode" : " Light Mode"}
                  </p>

                  {/* LOGOUT */}
                  <p className="logout" onClick={logout}>
                    <FaSignOutAlt /> Logout
                  </p>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <h2>Find Your Perfect Home</h2>
        <p>
          Rent houses, apartments, and flats easily. Trusted owners, verified listings, and smooth rental experience.
        </p>

        <div className="hero-buttons">
          <button onClick={handleGetStarted} className="btn primary">
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <h3>Why Choose RentEasy?</h3>

        <div className="grid">
          <div className="card">
            <h4>🏠 Verified Listings</h4>
            <p>All homes are verified to ensure safety and reliability.</p>
          </div>

          <div className="card">
            <h4>💸 Affordable Rentals</h4>
            <p>Find budget-friendly rental options that fit your lifestyle.</p>
          </div>

          <div className="card">
            <h4>📍 Search by Location</h4>
            <p>Browse homes in your favorite neighborhoods with maps.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 RentEasy — Your Trusted Home Renting Partner</p>
        <div>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
        </div>
      </footer>

      {/* PROFILE MODAL */}
      {openProfile && (
        <ProfileCard user={user} onClose={() => setOpenProfile(false)} />
      )}

    </div>
  );
}
