import React, { useState } from "react";
import { signupUser } from "../api";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "", // Owner or Tenant
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 Convert UI role → backend role format
    let formattedValue = value;

    if (name === "role") {
      formattedValue =
        value === "Owner"
          ? "Owner"
          : value === "Tenant"
            ? "Tenant"
            : "";
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match");
      return;
    }

    if (!formData.role) {
      setMessage("Please select a role");
      return;
    }

    const result = await signupUser(formData);

    if (result.message === "User registered successfully") {
      setMessage("Signup successful! Redirecting...");

      setTimeout(() => {
        navigate("/"); // redirect to home page
      }, 1200);
    } else {
      setMessage(result.ERROR || result.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center p-5 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="w-full max-w-[400px] px-8 py-8 rounded-2xl bg-brand-surface-light border border-transparent shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-center backdrop-blur-md dark:bg-brand-surface-dark dark:border-white/5 dark:shadow-none">

        <h2 className="text-2xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark">Create your account</h2>
        <p className="text-sm text-brand-text-muted mb-6 dark:text-brand-text-darkMuted">Join RentEasy and start your journey.</p>

        {/* ROLE SELECTION */}
        <div className="flex justify-center gap-6 mb-6">
          <label className="font-medium text-brand-text-main cursor-pointer flex items-center dark:text-brand-text-dark">
            <input
              type="radio"
              name="role"
              value="Owner"
              onChange={handleChange}
              className="accent-brand-primary mr-2 scale-125 dark:accent-brand-secondary"
            />
            Owner
          </label>

          <label className="font-medium text-brand-text-main cursor-pointer flex items-center dark:text-brand-text-dark">
            <input
              type="radio"
              name="role"
              value="Tenant"
              onChange={handleChange}
              className="accent-brand-primary mr-2 scale-125 dark:accent-brand-secondary"
            />
            Tenant
          </label>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-gray-200 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          <button
            type="submit"
            className="w-full mt-2 p-3 text-[15px] font-bold bg-brand-primary text-white border-none rounded-xl cursor-pointer transition duration-300 hover:bg-brand-accent shadow-lg shadow-brand-primary/30 dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white dark:shadow-none"
          >
            Sign Up
          </button>
        </form>

        {message && <p className="mt-4 text-sm font-semibold text-red-500">{message}</p>}

        <p className="mt-6 text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
          Already have an account? <a href="/login" className="text-brand-primary font-semibold hover:underline dark:text-brand-secondary">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
