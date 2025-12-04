import React, { useEffect, useState } from "react";
import { fetchHouseById, showInterest } from "../api";   // 🔥 added showInterest
import { useParams, useNavigate } from "react-router-dom"; // 🔥 added useNavigate
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate(); // 🔥 added

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingInterest, setLoadingInterest] = useState(false); // 🔥 added

  useEffect(() => {
    loadHouse();
  }, [id]);

  const loadHouse = async () => {
    setLoading(true);

    const res = await fetchHouseById(id);

    if (!res.ERROR) {
      setHouse(res.house);
    }

    setLoading(false);
  };

  // 🔥 NEW: Show Interest Handler
  const handleShowInterest = async () => {
    if (!house) return;

    setLoadingInterest(true);

    const res = await showInterest({ houseId: house.id });

    setLoadingInterest(false);

    if (res.ERROR) {
      alert(res.ERROR || "Failed to show interest");
      return;
    }

    alert(res.message || "Interest created");
    navigate("/my-bookings"); // 🔥 redirect
  };

  if (loading) return <p>Loading property details...</p>;
  if (!house) return <p>Property not found.</p>;

  return (
    <div className="details-container">
      <h1>{house.title}</h1>

      <p className="details-address">
        {house.address}, {house.city}, {house.state} - {house.zipcode}
      </p>

      <div className="details-box">

        <h3>Property Information</h3>

        <p><strong>Description:</strong> {house.description || "No description provided"}</p>
        <p><strong>Property Type:</strong> {house.property_type}</p>
        <p><strong>Bedrooms:</strong> {house.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {house.bathrooms}</p>
        <p><strong>Area:</strong> {house.area_sqft} sq ft</p>
        <p><strong>Rent:</strong> ₹{house.rent || "N/A"}</p>
        <p><strong>Status:</strong> {house.status}</p>

        {house.available_from && (
          <p>
            <strong>Available From:</strong>{" "}
            {new Date(house.available_from).toLocaleDateString()}
          </p>
        )}

        <h3>Owner Information</h3>
        <p><strong>Name:</strong> {house.owner?.name}</p>
        <p><strong>Username:</strong> {house.owner?.username}</p>

        {/* 🔥 NEW BUTTON */}
        <button
          className="interest-btn"
          onClick={handleShowInterest}
          disabled={loadingInterest}
        >
          {loadingInterest ? "Sending..." : "Show Interest"}
        </button>

      </div>
    </div>
  );
}
