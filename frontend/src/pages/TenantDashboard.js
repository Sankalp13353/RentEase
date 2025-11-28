import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TenantDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");

      try {
        const res = await fetch("http://localhost:5001/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.user && data.user.role === "tenant") setUser(data.user);
        else navigate("/auth"); 
      } catch (err) {
        console.error(err);
        navigate("/auth");
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2>Tenant Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default TenantDashboard;
