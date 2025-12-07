import React, { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await loginUser(credentials);

    if (result.token) {
      // Store token
      localStorage.setItem("token", result.token);

      // Store role (Owner / Tenant) for conditional redirects later if needed
      if (result.user?.role) {
        localStorage.setItem("role", result.user.role);
      }

      setMessage("Login successful! Redirecting...");

      // 🔥 Redirect to HOME PAGE
      setTimeout(() => {
        navigate("/");
      }, 1200);
    } else {
      setMessage(result.ERROR || result.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center p-5 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="w-full max-w-[360px] px-8 py-8 rounded-2xl bg-brand-surface-light border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-center backdrop-blur-md dark:bg-brand-surface-dark dark:border-white/5 dark:shadow-none">

        <h2 className="text-2xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark">Welcome Back</h2>
        <p className="text-sm text-brand-text-muted mb-6 dark:text-brand-text-darkMuted">Login to RentEasy and manage your rentals.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={credentials.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mb-4 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 mb-4 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <button
            type="submit"
            className="w-full p-3 text-[15px] font-bold bg-brand-primary text-white border-none rounded-xl cursor-pointer transition duration-300 hover:bg-brand-accent shadow-lg shadow-brand-primary/30 dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white dark:shadow-none"
          >
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-sm font-semibold text-red-500">{message}</p>}

        <p className="mt-6 text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
          Don’t have an account? <a href="/signup" className="text-brand-primary font-semibold hover:underline dark:text-brand-secondary">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
