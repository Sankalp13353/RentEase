import React, { useEffect, useState } from "react";
import { fetchMyInterests, cancelInterest } from "../api";
import { Link } from "react-router-dom";

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
      load();
    } else {
      alert(res.ERROR || "Failed to cancel");
    }
  };

  if (loading) return <p className="text-center mt-10 text-brand-text-muted dark:text-brand-text-darkMuted">Loading your bookings...</p>;

  return (
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="max-w-[900px] mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-main dark:text-brand-text-dark">My Bookings</h1>
          <Link to="/dashboard" className="text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>
        </div>

        {interests.length === 0 ?
        <p className="text-center text-lg text-brand-text-muted dark:text-brand-text-darkMuted mt-10">You have not shown interest in any properties yet.</p> :

        <div className="flex flex-col gap-6">
            {interests.map((it) =>
          <div key={it.id} className="bg-brand-surface-light p-6 rounded-2xl border border-transparent shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition duration-200 hover:scale-[1.01] hover:shadow-lg dark:bg-brand-surface-dark dark:border-white/5 dark:shadow-none">

                <div className="flex justify-between items-start max-md:flex-col max-md:gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold text-brand-text-main dark:text-brand-text-dark mb-1">{it.house?.title}</h3>
                    <p className="text-brand-text-muted dark:text-brand-text-darkMuted mb-2">{it.house?.address}, {it.house?.city}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${it.status === "Approved" ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" :
              it.status === "Rejected" ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" :
              "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20"}`
              }>
                    {it.status}
                  </span>
                </div>

                <div className="my-4 border-t border-gray-100 dark:border-white/10"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-brand-text-main dark:text-brand-text-dark">
                  <p>
                    <span className="text-brand-text-muted dark:text-brand-text-darkMuted">Rent:</span> <strong className="ml-1 text-base">₹{it.house?.rent || "N/A"}</strong>
                  </p>
                  <p>
                    <span className="text-brand-text-muted dark:text-brand-text-darkMuted">Owner:</span> <strong className="ml-1">{it.house?.owner?.name || it.house?.owner?.username}</strong>
                  </p>

                  {}
                  {it.status === "Approved" ?
              <div className="col-span-2 p-3 bg-green-50 rounded-lg border border-green-100 dark:bg-green-500/5 dark:border-green-500/10">
                      <p className="text-green-800 dark:text-green-300">
                        <strong>✨ Owner Email:</strong> {it.house?.owner?.email || "N/A"}
                      </p>
                    </div> :

              <p className="col-span-2 text-brand-text-muted dark:text-brand-text-darkMuted italic text-xs">
                      * Owner contact will be revealed when your request is approved.
                    </p>
              }
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                onClick={() => window.location.href = `/property/${it.house_id}`}
                className="px-5 py-2.5 bg-brand-primary text-white rounded-xl font-medium shadow-md shadow-brand-primary/20 hover:bg-brand-accent transition dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white">

                    View Property
                  </button>
                  <button
                onClick={() => handleCancel(it.id)}
                className="px-5 py-2.5 bg-transparent border border-red-200 text-red-500 rounded-xl font-medium hover:bg-red-50 hover:border-red-300 transition dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10">

                    Cancel Request
                  </button>
                </div>
              </div>
          )}
          </div>
        }
      </div>
    </div>);

}