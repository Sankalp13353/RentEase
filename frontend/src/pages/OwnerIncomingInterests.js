// src/pages/OwnerIncomingInterests.jsx
import React, { useEffect, useState } from "react";
import { fetchOwnerInterests } from "../api";
import "./OwnerIncomingInterests.css"; // optional; create if you want styles

export default function OwnerIncomingInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchOwnerInterests();
        if (res.ERROR) {
          setError(res.ERROR || "Failed to load interests");
          setInterests([]);
        } else {
          // backend returns { interests: [...] } per our controller
          setInterests(res.interests || []);
        }
      } catch (err) {
        setError(err.message || "Unexpected error");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="incoming-container">
      <h1>Tenant Interests</h1>

      {loading && <p>Loading incoming interests...</p>}

      {!loading && error && <p className="error">{error}</p>}

      {!loading && !error && interests.length === 0 && (
        <p>No tenant has shown interest yet.</p>
      )}

      {!loading && !error && interests.length > 0 && (
        <div className="incoming-list">
          {interests.map((item) => (
            <div key={item.id} className="incoming-card">
              <h3>{item.house?.title || "Untitled property"}</h3>

              <p>
                <strong>Tenant:</strong> {item.tenant?.name || "Unknown"}{" "}
                <span>({item.tenant?.email || "No email"})</span>
              </p>

              <p>
                <strong>Address:</strong> {item.house?.address || "-"},{" "}
                {item.house?.city || "-"}
              </p>

              <p>
                <strong>Rent:</strong>{" "}
                {item.house?.rent !== null && item.house?.rent !== undefined
                  ? `₹${item.house.rent}`
                  : "N/A"}
              </p>

              <p>
                <strong>Message:</strong> {item.message || "—"}
              </p>

              <p className="time-stamp">
                Received: {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
