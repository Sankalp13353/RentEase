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

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [navigate]);

  const role = user.role?.toLowerCase();

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-y-auto flex flex-col font-poppins bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">

      {}
      <nav className="w-full h-16 px-10 flex items-center justify-start sticky top-0 z-50 bg-brand-surface-light/80 backdrop-blur-md shadow-sm dark:bg-brand-surface-dark/80 dark:shadow-none transition-colors duration-300">
        <h2 className="font-bold text-2xl text-brand-primary dark:text-brand-secondary mr-auto tracking-tight">RentEasy</h2>
      </nav>

      {}
      <div className="flex-1 text-center mt-[60px] px-5 pb-[60px] flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-3 text-brand-text-main dark:text-brand-text-dark max-md:text-3xl">Welcome back, {user.name}</h1>

        {role === "owner" ?
        <p className="text-lg text-brand-text-muted mb-12 dark:text-brand-text-darkMuted">Manage your rental properties easily.</p> :

        <p className="text-lg text-brand-text-muted mb-12 dark:text-brand-text-darkMuted">Find the perfect home for rent.</p>
        }

        {}
        {role === "owner" &&
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full max-w-[1100px] mx-auto">

            <div
            className="bg-brand-surface-light rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5"
            onClick={() => navigate("/add-property")}>

              <h3 className="mb-3 text-xl font-semibold text-brand-text-main dark:text-brand-text-dark">🏠 Add Property</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted leading-relaxed">List a new house, room, or apartment for rent to reach millions of tenants.</p>
            </div>

            <div
            className="bg-brand-surface-light rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5"
            onClick={() => navigate("/my-properties")}>

              <h3 className="mb-3 text-xl font-semibold text-brand-text-main dark:text-brand-text-dark">📋 My Properties</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted leading-relaxed">View, edit, or remove properties you listed. Track their status.</p>
            </div>

            <div
            className="bg-brand-surface-light rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5"
            onClick={() => navigate("/tenants")}>

              <h3 className="mb-3 text-xl font-semibold text-brand-text-main dark:text-brand-text-dark">🧑‍🤝‍🧑 Tenants</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted leading-relaxed">Track renters who booked your properties and manage applications.</p>
            </div>

          </div>
        }

        {}
        {role === "tenant" &&
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-8 w-full max-w-[1100px] mx-auto">

            <div
            className="bg-brand-surface-light rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5"
            onClick={() => navigate("/browse-properties")}>

              <h3 className="mb-3 text-xl font-semibold text-brand-text-main dark:text-brand-text-dark">🔍 Browse Properties</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted leading-relaxed">Search rental houses and rooms in your preferred areas.</p>
            </div>

            <div
            className="bg-brand-surface-light rounded-2xl p-8 text-left shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5"
            onClick={() => navigate("/my-bookings")}>

              <h3 className="mb-3 text-xl font-semibold text-brand-text-main dark:text-brand-text-dark">📄 My Bookings</h3>
              <p className="text-sm text-brand-text-muted dark:text-brand-text-darkMuted leading-relaxed">View properties you requested or booked. Check status updates.</p>
            </div>

          </div>
        }

      </div>
    </div>);

};

export default DashboardPage;