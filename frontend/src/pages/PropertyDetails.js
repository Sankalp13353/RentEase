import React, { useEffect, useState } from "react";
import { fetchHouseById } from "../api";
import { useParams } from "react-router-dom";
import "./PropertyDetails.css";

export default function PropertyDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

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

        <button className="interest-btn">Show Interest</button>

      </div>
    </div>
  );
}
