import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Auth = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); 
  const [role, setRole] = useState("tenant"); 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    const url =
      mode === "signup"
        ? "http://localhost:5001/signup"
        : "http://localhost:5001/login";

    const body =
      mode === "signup"
        ? { name, email, password, role }
        : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (mode === "login" && data.token) {

        localStorage.setItem("token", data.token);

      
        if (data.user.role === "tenant") navigate("/tenant-dashboard");
        else if (data.user.role === "owner") navigate("/owner-dashboard");
      } else if (mode === "signup") {
        alert("Signup successful! You can now login.");
        setMode("login"); 
      }

      console.log(data);
    }catch (err) {
      console.error(err);
      const message = err.message || "Something went wrong";
      alert(message);
    }    
  };

  return (
    <div className="auth-container">
      <h2>{mode === "login" ? "Login" : "Create Account"}</h2>

      <div className="switch-mode">
        <button
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Login
        </button>

        <button
          className={mode === "signup" ? "active" : ""}
          onClick={() => setMode("signup")}
        >
          Signup
        </button>
      </div>

      {mode === "signup" && (
        <div className="role-select">
          <label>
            <input
              type="radio"
              value="tenant"
              checked={role === "tenant"}
              onChange={() => setRole("tenant")}
            />
            Tenant
          </label>

          <label>
            <input
              type="radio"
              value="owner"
              checked={role === "owner"}
              onChange={() => setRole("owner")}
            />
            Owner
          </label>
        </div>
      )}

      <div className="auth-form">
        {mode === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="cta-btn" onClick={handleSubmit}>
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
