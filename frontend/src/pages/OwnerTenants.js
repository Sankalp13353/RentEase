import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const OwnerTenants = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchApplications();
  }, [token, navigate]);

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "https://freelancehub-1efa.onrender.com/api/applications/owner",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data.applications);
    } catch (err) {
      console.error("Error fetching tenant applications:", err);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-main dark:text-brand-text-dark">Tenant Applications</h1>
          <Link to="/dashboard" className="text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>
        </div>

        {applications.length === 0 ?
        <p className="text-brand-text-muted text-lg dark:text-brand-text-darkMuted text-center py-10">No tenant applications yet.</p> :

        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {applications.map((app) =>
          <div key={app.id} className="w-[300px] bg-brand-surface-light p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-transparent transition hover:shadow-lg dark:bg-brand-surface-dark dark:backdrop-blur-md dark:border-white/5 dark:shadow-none dark:hover:bg-white/5">
                <h3 className="text-xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark">{app.tenantName}</h3>
                <p className="text-sm text-brand-text-muted mb-1 dark:text-brand-text-darkMuted"><strong>Email:</strong> {app.tenantEmail}</p>
                <p className="text-sm text-brand-text-muted mb-1 dark:text-brand-text-darkMuted"><strong>Property:</strong> {app.houseTitle}</p>
                <div className="my-3 border-t border-gray-100 dark:border-white/10"></div>

                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-brand-text-main dark:text-brand-text-dark">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${app.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-white/10 dark:text-gray-300 dark:border-white/10'}`}>
                    {app.status}
                  </span>
                </div>

                {app.message &&
            <div className="mt-3 p-3 bg-gray-50 rounded-xl text-sm italic text-brand-text-muted border border-gray-100 dark:bg-white/5 dark:text-brand-text-darkMuted dark:border-white/5">
                    "{app.message}"
                  </div>
            }
              </div>
          )}
          </div>
        }
      </div>
    </div>);

};

export default OwnerTenants;