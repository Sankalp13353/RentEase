import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerMyProperties.css";

import baseApi, { deleteHouse } from "../api";

const OwnerMyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await baseApi.get("/api/houses/my-properties");
        setProperties(res.data.houses || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const response = await deleteHouse(id);

    if (response.ERROR) {
      console.error("Delete failed:", response.ERROR);
      return;
    }

    setProperties((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>

      {loading ? (
        <p>Loading your properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties listed yet.</p>
      ) : (
        <div className="properties-list">
          {properties.map((house) => (
            <div key={house.id} className="property-card">
              <h3>{house.title}</h3>
              <p>{house.address}, {house.city}</p>
              <p><strong>Rent:</strong> ₹{house.rent || "N/A"}</p>

              <div className="property-actions">
                {/* ❌ EDIT BUTTON REMOVED */}
                <button onClick={() => handleDelete(house.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerMyProperties;
