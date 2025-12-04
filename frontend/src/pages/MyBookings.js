// src/pages/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { fetchMyInterests, cancelInterest } from "../api";
import "./MyBookings.css"; // optional

export default function MyBookings() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetchMyInterests();
    if (!res.ERROR) {
      setInterests(res.interests || []);
    } else {
      setInterests([]);
      console.error(res.ERROR);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this interest?")) return;
    const res = await cancelInterest(id);
    if (!res.ERROR) {
      // refresh
      load();
    } else {
      alert(res.ERROR || "Failed to cancel");
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="my-bookings-container">
      <h1>My Bookings</h1>

      {interests.length === 0 ? (
        <p>You have not shown interest in any properties yet.</p>
      ) : (
        <div className="bookings-list">
          {interests.map((it) => (
            <div key={it.id} className="booking-card">
              <h3>{it.house?.title}</h3>
              <p>{it.house?.address}, {it.house?.city}</p>
              <p><strong>Rent:</strong> ₹{it.house?.rent || "N/A"}</p>
              <p><strong>Owner:</strong> {it.house?.owner?.name || it.house?.owner?.username}</p>
              <p><strong>Requested At:</strong> {new Date(it.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> {it.status}</p>

              <div className="booking-actions">
                <button onClick={() => window.location.href = `/property/${it.house_id}`}>View Property</button>
                <button onClick={() => handleCancel(it.id)}>Cancel</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
