import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, Link } from "react-router-dom";
import { FaUserCircle, FaUser, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import ProfileCard from "./ProfileCard";

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
      } catch { }
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Tailwind Dark Mode Logic
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenu(false);
  };

  const handleGetStarted = () => {
    if (!user) {
      navigate("/signup");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="w-full bg-[#fafbff] text-[#1f1f1f] duration-300 dark:bg-[#0f1118] dark:text-[#eaeaea]">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-10 py-5 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.06)] sticky top-0 z-50 transition-colors duration-300 dark:bg-[#1a1d26]/80 dark:shadow-none">
        <h1 className="text-[30px] font-bold text-[#4f6df5] tracking-[-0.8px] dark:text-[#88a2ff]">RentEasy</h1>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="bg-transparent border-none px-5 py-2.5 text-[15px] cursor-pointer rounded-xl font-medium text-[#1f1f1f] transition duration-250 hover:bg-[#4f6df5]/10 hover:text-[#4f6df5] dark:text-[#eaeaea] dark:hover:text-[#88a2ff]"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#4f6df5] text-white px-5 py-2.5 text-[15px] cursor-pointer rounded-xl font-medium border-none shadow-[0_5px_15px_rgba(79,109,245,0.4)] transition hover:bg-[#6f85ff] dark:bg-[#88a2ff] dark:hover:bg-[#bcd1ff] dark:text-[#1a1d26]"
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="relative">
              <FaUserCircle
                onClick={() => setMenu(!menu)}
                className="text-[34px] cursor-pointer text-[#4f6df5] transition duration-200 hover:scale-105 dark:text-[#88a2ff]"
              />

              {menu && (
                <div className="absolute right-0 top-12 bg-white shadow-[0_14px_45px_rgba(0,0,0,0.08)] rounded-xl w-[180px] overflow-hidden animate-fade transition-colors duration-300 dark:bg-[#1a1d26] dark:shadow-lg">

                  {/* OPEN PROFILE MODAL */}
                  <div
                    onClick={() => {
                      setOpenProfile(true);
                      setMenu(false);
                    }}
                    className="px-4 py-3.5 cursor-pointer text-[15px] border-b border-[#e6e6e6]/30 text-[#1f1f1f] flex items-center gap-2.5 hover:bg-[#4f6df5]/10 hover:text-[#4f6df5] dark:text-[#eaeaea] dark:hover:text-[#88a2ff]"
                  >
                    <FaUser /> Profile
                  </div>

                  {/* THEME SWITCH */}
                  <div
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="px-4 py-3.5 cursor-pointer text-[15px] border-b border-[#e6e6e6]/30 text-[#1f1f1f] flex items-center gap-2.5 hover:bg-[#4f6df5]/10 hover:text-[#4f6df5] dark:text-[#eaeaea] dark:hover:text-[#88a2ff]"
                  >
                    {theme === "light" ? <FaMoon /> : <FaSun />}
                    {theme === "light" ? " Dark Mode" : " Light Mode"}
                  </div>

                  {/* LOGOUT */}
                  <div
                    className="px-4 py-3.5 cursor-pointer text-[15px] flex items-center gap-2.5 text-[#d44141] hover:bg-[#d44141]/10"
                    onClick={logout}
                  >
                    <FaSignOutAlt /> Logout
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="text-center px-8 py-[100px]">
        <h2 className="text-5xl font-bold mb-3">Find Your Perfect Home</h2>
        <p className="text-lg opacity-75 mt-3 max-w-2xl mx-auto">
          Rent houses, apartments, and flats easily. Trusted owners, verified listings, and smooth rental experience.
        </p>

        <div className="mt-9">
          <button
            onClick={handleGetStarted}
            className="px-7 py-3.5 text-[17px] rounded-xl border-none cursor-pointer font-medium bg-[#4f6df5] text-white transition duration-250 hover:bg-[#6f85ff] hover:-translate-y-1 shadow-lg dark:bg-[#88a2ff] dark:text-[#1a1d26] dark:hover:bg-[#bcd1ff]"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="text-center px-10 py-[100px] bg-[#fafbff] dark:bg-[#0f1118]">
        <h3 className="text-[34px] font-semibold mb-12">Why Choose RentEasy?</h3>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 max-w-[1100px] mx-auto">
          <div className="p-8 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2.5 hover:shadow-[0_14px_45px_rgba(0,0,0,0.08)] dark:bg-[#1a1d26] dark:shadow-none">
            <h4 className="text-xl font-semibold mb-2.5">🏠 Verified Listings</h4>
            <p className="text-[15px] opacity-70">All homes are verified to ensure safety and reliability.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2.5 hover:shadow-[0_14px_45px_rgba(0,0,0,0.08)] dark:bg-[#1a1d26] dark:shadow-none">
            <h4 className="text-xl font-semibold mb-2.5">💸 Affordable Rentals</h4>
            <p className="text-[15px] opacity-70">Find budget-friendly rental options that fit your lifestyle.</p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2.5 hover:shadow-[0_14px_45px_rgba(0,0,0,0.08)] dark:bg-[#1a1d26] dark:shadow-none">
            <h4 className="text-xl font-semibold mb-2.5">📍 Search by Location</h4>
            <p className="text-[15px] opacity-70">Browse homes in your favorite neighborhoods with maps.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-9 text-[15px] text-center border-t border-[#eee] mt-20 bg-white transition duration-300 dark:bg-[#1a1d26] dark:border-[#333]">
        <p className="mb-4 text-[#5f5f5f] dark:text-[#b3b3b3]">© 2025 RentEasy — Your Trusted Home Renting Partner</p>

        <div className="flex justify-center gap-6">
          <Link to="/terms" className="no-underline text-[#5f5f5f] transition hover:text-[#4f6df5] dark:text-[#b3b3b3] dark:hover:text-[#88a2ff]">Terms</Link>
          <Link to="/privacy" className="no-underline text-[#5f5f5f] transition hover:text-[#4f6df5] dark:text-[#b3b3b3] dark:hover:text-[#88a2ff]">Privacy</Link>
          <Link to="/support" className="no-underline text-[#5f5f5f] transition hover:text-[#4f6df5] dark:text-[#b3b3b3] dark:hover:text-[#88a2ff]">Support</Link>
        </div>
      </footer>

      {/* PROFILE MODAL */}
      {openProfile && (
        <ProfileCard user={user} onClose={() => setOpenProfile(false)} />
      )}

    </div>
  );
}
