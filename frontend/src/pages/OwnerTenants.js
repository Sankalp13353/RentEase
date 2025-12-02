import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OwnerTenants.css";

const OwnerTenants = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [token, navigate]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "https://freelancehub-1efa.onrender.com/api/applications/owner",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching tenant applications:", err);
    }
  };

  return (
    <div className="tenants-container">
      <h1>Tenant Applications</h1>
      {applications.length === 0 ? (
        <p>No tenant applications yet.</p>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <h3>{app.tenantName}</h3>
              <p>Email: {app.tenantEmail}</p>
              <p>Property: {app.houseTitle}</p>
              <p>Status: {app.status}</p>
              {app.message && <p>Message: {app.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerTenants;
