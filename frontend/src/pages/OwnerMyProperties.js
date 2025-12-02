import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OwnerMyProperties.css";

const OwnerMyProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProperties();
  }, [token, navigate]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(
        "https://freelancehub-1efa.onrender.com/api/houses/owner", 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProperties(res.data.houses);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await axios.delete(
        `https://freelancehub-1efa.onrender.com/api/houses/${id}`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProperties(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>
      {properties.length === 0 ? (
        <p>No properties listed yet.</p>
      ) : (
        <div className="properties-list">
          {properties.map((house) => (
            <div key={house.id} className="property-card">
              <h3>{house.title}</h3>
              <p>{house.address}, {house.city}</p>
              <p>Rent: ₹{house.rent}</p>
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
