import React, { useEffect, useState } from "react";
import { fetchIncomingInterests } from "../api";
import "./OwnerIncomingInterests.css";

export default function OwnerIncomingInterests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterests();
  }, []);

  const loadInterests = async () => {
    setLoading(true);
    const res = await fetchIncomingInterests();

    if (!res.ERROR) {
      setInterests(res.interests || []);
    }

    setLoading(false);
  };

  return (
    <div className="incoming-container">
      <h1>Tenant Interests</h1>

      {loading ? (
        <p>Loading...</p>
      ) : interests.length === 0 ? (
        <p>No tenant has shown interest yet.</p>
      ) : (
        <div className="incoming-list">
          {interests.map((item) => (
            <div key={item.id} className="incoming-card">
              <h3>{item.house.title}</h3>

              <p>
                <strong>Tenant:</strong> {item.tenant.name}  
                ({item.tenant.email})
              </p>

              <p>
                <strong>Address:</strong> {item.house.address},{" "}
                {item.house.city}
              </p>

              <p><strong>Message:</strong> {item.message || "No message"}</p>

              <p className="time-stamp">
                Received At:{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
