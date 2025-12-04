import React, { useEffect, useState } from "react";
import { fetchHouses } from "../api";
import "./BrowseProperties.css";

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);

    const res = await fetchHouses(); // no filters → get all ForSale houses

    if (!res.ERROR) {
      setProperties(res.houses || []);
    }

    setLoading(false);
  };

  return (
    <div className="browse-container">
      <h1>Browse Properties</h1>

      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties available right now.</p>
      ) : (
        <div className="browse-list">
          {properties.map((house) => (
            <div key={house.id} className="browse-card">
              <h3>{house.title}</h3>
              <p>{house.address}, {house.city}</p>

              <p><strong>Rent:</strong> ₹{house.rent || "N/A"}</p>
              <p><strong>Bedrooms:</strong> {house.bedrooms}</p>
              <p><strong>Bathrooms:</strong> {house.bathrooms}</p>

              <button
                className="details-btn"
                onClick={() => window.location.href = `/property/${house.id}`}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

}
