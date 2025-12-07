import React, { useEffect, useState } from "react";
import { fetchOwnerInterests } from "../api";
import { Link } from "react-router-dom";

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
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="max-w-4xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-main dark:text-brand-text-dark">Tenant Interests</h1>
          <Link to="/dashboard" className="text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>
        </div>

        {loading && <p className="text-brand-text-muted dark:text-brand-text-darkMuted">Loading incoming interests...</p>}

        {!loading && error && <p className="text-red-500 font-medium">{error}</p>}

        {!loading && !error && interests.length === 0 && (
          <p className="text-brand-text-muted dark:text-brand-text-darkMuted text-lg">No tenant has shown interest yet.</p>
        )}

        {!loading && !error && interests.length > 0 && (
          <div className="flex flex-col gap-5 mt-4">
            {interests.map((item) => (
              <div key={item.id} className="bg-brand-surface-light p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-transparent transition hover:shadow-lg dark:bg-brand-surface-dark dark:backdrop-blur-md dark:border-white/5 dark:shadow-none">
                <h3 className="text-xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark">{item.house?.title || "Untitled property"}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-brand-text-muted dark:text-brand-text-darkMuted">
                  <p>
                    <strong className="text-brand-text-main dark:text-brand-text-dark">Tenant:</strong> {item.tenant?.name || "Unknown"}{" "}
                    <span className="text-brand-primary dark:text-brand-secondary">({item.tenant?.email || "No email"})</span>
                  </p>

                  <p>
                    <strong className="text-brand-text-main dark:text-brand-text-dark">Address:</strong> {item.house?.address || "-"},{" "}
                    {item.house?.city || "-"}
                  </p>

                  <p>
                    <strong className="text-brand-text-main dark:text-brand-text-dark">Rent:</strong>{" "}
                    {item.house?.rent !== null && item.house?.rent !== undefined
                      ? `₹${item.house.rent}`
                      : "N/A"}
                  </p>

                  <p>
                    <strong className="text-brand-text-main dark:text-brand-text-dark">Message:</strong> {item.message || "—"}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center text-xs text-brand-text-muted dark:text-brand-text-darkMuted">
                  <span>Received: {new Date(item.created_at).toLocaleString()}</span>
                  {/* Could add action buttons here later if needed */}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
