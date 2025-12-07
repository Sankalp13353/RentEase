import React, { useEffect, useState } from "react";
import { fetchHouseById, showInterest } from "../api";
import { useParams, useNavigate } from "react-router-dom";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingInterest, setLoadingInterest] = useState(false);

  useEffect(() => {
    const loadHouse = async () => {
      setLoading(true);

      const res = await fetchHouseById(id);

      if (!res.ERROR) {
        setHouse(res.house);
      }

      setLoading(false);
    };

    loadHouse();
  }, [id]);

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
    navigate("/my-bookings");
  };

  if (loading) return <p className="text-center mt-10 text-brand-text-muted dark:text-brand-text-darkMuted">Loading property details...</p>;
  if (!house) return <p className="text-center mt-10 text-brand-text-muted dark:text-brand-text-darkMuted">Property not found.</p>;

  return (
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark flex justify-center py-12">
      <div className="w-full max-w-4xl">
        <button onClick={() => navigate(-1)} className="mb-6 text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back</button>

        <h1 className="text-4xl font-bold text-brand-text-main mb-2 dark:text-brand-text-dark">{house.title}</h1>

        <p className="text-xl text-brand-text-muted mb-8 dark:text-brand-text-darkMuted">
          📍 {house.address}, {house.city}, {house.state} - {house.zipcode}
        </p>

        <div className="bg-brand-surface-light p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-transparent dark:bg-brand-surface-dark dark:backdrop-blur-md dark:border-white/5 dark:shadow-none">

          <h3 className="text-2xl font-semibold mb-6 pb-4 border-b border-gray-100 dark:border-white/10 dark:text-white">Property Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-lg text-brand-text-main dark:text-brand-text-dark mb-8">
            <p className="col-span-2"><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Description</strong> {house.description || "No description provided"}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Property Type</strong> {house.property_type}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Status</strong> {house.status}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Bedrooms</strong> {house.bedrooms}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Bathrooms</strong> {house.bathrooms}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Area</strong> {house.area_sqft} sq ft</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Rent</strong> <span className="text-brand-primary font-bold dark:text-brand-secondary">₹{house.rent || "N/A"}</span></p>

            {house.available_from && (
              <p>
                <strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted block text-sm mb-1">Available From</strong>{" "}
                {new Date(house.available_from).toLocaleDateString()}
              </p>
            )}
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-6 pb-4 border-b border-gray-100 dark:border-white/10 dark:text-white">Owner Information</h3>
          <div className="space-y-3 text-lg text-brand-text-main dark:text-brand-text-dark">
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted">Name:</strong> {house.owner?.name}</p>
            <p><strong className="font-semibold text-brand-text-muted dark:text-brand-text-darkMuted">Username:</strong> {house.owner?.username}</p>
          </div>

          <button
            className="w-full mt-10 py-4 bg-brand-primary text-white text-lg rounded-xl font-bold hover:bg-brand-accent shadow-lg shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white dark:shadow-none"
            onClick={handleShowInterest}
            disabled={loadingInterest}
          >
            {loadingInterest ? "Sending Request..." : "Show Interest"}
          </button>

        </div>
      </div>
    </div>
  );
}
