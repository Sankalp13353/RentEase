import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    role: ""
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
        role: decoded.role
      });
    } catch (err) {
      navigate("/");
      return;
    }

    const savedTheme = localStorage.getItem("theme") || "light";
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [navigate]);

  const role = user.role?.toLowerCase();

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-y-auto flex flex-col font-poppins bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">


      <nav className="w-full h-16 px-10 flex items-center justify-start sticky top-0 z-50 bg-brand-surface-light/80 backdrop-blur-md shadow-sm dark:bg-brand-surface-dark/80 dark:shadow-none transition-colors duration-300">
        <h2
          onClick={() => navigate("/")}
          className="font-bold text-2xl text-brand-primary dark:text-brand-secondary mr-auto tracking-tight cursor-pointer hover:opacity-80 transition"
        >
          RentEasy
        </h2>
      </nav>


      <div className="flex-1 text-center mt-[60px] px-5 pb-[60px] flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-3 max-md:text-3xl">
          Welcome back, {user.name}
        </h1>

        {role === "owner" ? (
          <p className="text-lg text-brand-text-muted mb-12 dark:text-brand-text-darkMuted">
            Manage your rental properties easily.
          </p>
        ) : (
          <p className="text-lg text-brand-text-muted mb-12 dark:text-brand-text-darkMuted">
            Find the perfect home for rent.
          </p>
        )}


        {role === "owner" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full max-w-[1100px] mx-auto">
            <div
              onClick={() => navigate("/add-property")}
              className="bg-brand-surface-light rounded-2xl p-8 text-left shadow transition cursor-pointer hover:-translate-y-2 dark:bg-brand-surface-dark"
            >
              <h3 className="mb-3 text-xl font-semibold">🏠 Add Property</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                List a new property for rent.
              </p>
            </div>

            <div
              onClick={() => navigate("/my-properties")}
              className="bg-brand-surface-light rounded-2xl p-8 text-left shadow transition cursor-pointer hover:-translate-y-2 dark:bg-brand-surface-dark"
            >
              <h3 className="mb-3 text-xl font-semibold">📋 My Properties</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                Manage properties you listed.
              </p>
            </div>

            <div
              onClick={() => navigate("/tenants")}
              className="bg-brand-surface-light rounded-2xl p-8 text-left shadow transition cursor-pointer hover:-translate-y-2 dark:bg-brand-surface-dark"
            >
              <h3 className="mb-3 text-xl font-semibold">🧑‍🤝‍🧑 Tenants</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                View tenant requests and interests.
              </p>
            </div>
          </div>
        )}


        {role === "tenant" && (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full max-w-[1100px] mx-auto">
            <div
              onClick={() => navigate("/browse-properties")}
              className="bg-brand-surface-light rounded-2xl p-8 text-left shadow transition cursor-pointer hover:-translate-y-2 dark:bg-brand-surface-dark"
            >
              <h3 className="mb-3 text-xl font-semibold">🔍 Browse Properties</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                Search available rental homes.
              </p>
            </div>

            <div
              onClick={() => navigate("/my-bookings")}
              className="bg-brand-surface-light rounded-2xl p-8 text-left shadow transition cursor-pointer hover:-translate-y-2 dark:bg-brand-surface-dark"
            >
              <h3 className="mb-3 text-xl font-semibold">📄 My Bookings</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                Track your booking requests.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
