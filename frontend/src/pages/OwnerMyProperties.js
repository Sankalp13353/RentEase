import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./OwnerMyProperties.css";

const API_BASE = process.env.REACT_APP_BACKEND_SERVER_URL;

const OwnerMyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Decode owner ID from token
  const user = token ? jwtDecode(token) : null;
  const ownerId = user?.id;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProperties = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/houses/owner/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setProperties(res.data.houses || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token, ownerId, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      await axios.delete(`${API_BASE}/api/houses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProperties((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err);
    }
  };

  const handleEdit = (id) => navigate(`/edit-property/${id}`);

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
                <button onClick={() => handleEdit(house.id)}>Edit</button>
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
