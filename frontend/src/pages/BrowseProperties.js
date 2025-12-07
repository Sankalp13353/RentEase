import React, { useEffect, useState, useCallback } from "react";
import { fetchHouses } from "../api";
import { Link } from "react-router-dom";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent", "Studio", "Other"];

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Sorting
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5; // default entries per page
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Fetch properties with filters
  const loadProperties = useCallback(async () => {
    setLoading(true);

    const params = {
      search: debouncedSearch || undefined,
      property_type: propertyType || undefined,
      sort,
      order,
      page,
      limit,
    };

    const res = await fetchHouses(params);

    if (!res.ERROR) {
      setProperties(res.houses || []);
      setPagination(res.pagination || { total: 0, totalPages: 1 });
    }

    setLoading(false);
  }, [debouncedSearch, propertyType, sort, order, page, limit]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const resetFilters = () => {
    setSearch("");
    setPropertyType("");
    setSort("created_at");
    setOrder("desc");
    setPage(1);
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-brand-text-main dark:text-brand-text-dark">Browse Properties</h1>
          <Link to="/dashboard" className="text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>
        </div>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-brand-surface-light p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:bg-brand-surface-dark dark:border-white/5 dark:shadow-none">

          {/* MAIN SEARCH */}
          <input
            placeholder="Search title, city, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary"
          />

          {/* PROPERTY TYPE */}
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* SORT OPTIONS */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black"
          >
            <option value="created_at">Newest</option>
            <option value="rent">Rent</option>
          </select>

          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-medium dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
          >
            Reset
          </button>
        </div>

        {/* PROPERTY LIST */}
        {loading ? (
          <p className="text-brand-text-muted dark:text-brand-text-darkMuted text-center py-10">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-brand-text-muted dark:text-brand-text-darkMuted text-center py-10">No properties match your search.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
              {properties.map((house) => (
                <div key={house.id} className="w-[300px] bg-brand-surface-light p-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_14px_45px_rgba(0,0,0,0.1)] border border-transparent dark:bg-brand-surface-dark dark:shadow-none dark:hover:bg-white/5 dark:border-white/5">
                  <h3 className="text-xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark truncate leading-tight">{house.title}</h3>

                  <p className="text-sm text-brand-text-muted mb-2 dark:text-brand-text-darkMuted flex items-center gap-1">
                    📍 {house.address}, {house.city}
                  </p>

                  <div className="my-3 border-t border-gray-100 dark:border-white/10"></div>

                  <p className="text-base text-brand-text-main mb-1 dark:text-brand-text-dark">
                    <strong className="font-semibold">Rent:</strong> <span className="text-brand-primary dark:text-brand-secondary font-bold">₹{house.rent || "N/A"}</span>
                  </p>

                  <div className="flex justify-between text-sm text-brand-text-muted dark:text-brand-text-darkMuted mb-4">
                    <span>🛏 {house.bedrooms} Bed</span>
                    <span>🚿 {house.bathrooms} Bath</span>
                  </div>

                  <button
                    className="w-full mt-2 py-3 bg-brand-primary text-white rounded-xl font-semibold shadow-lg shadow-brand-primary/30 transition hover:bg-brand-accent hover:shadow-brand-accent/40 dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white dark:shadow-none"
                    onClick={() =>
                      (window.location.href = `/property/${house.id}`)
                    }
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className="flex gap-2 mt-12 items-center justify-center">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 bg-brand-surface-light border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const p = i + 1;
                return (
                  <button
                    key={p}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${p === page ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/30 dark:bg-brand-secondary dark:text-brand-surface-dark dark:border-brand-secondary" : "bg-brand-surface-light border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 bg-brand-surface-light border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
              >
                Next
              </button>
            </div>

            <p className="text-center text-sm text-brand-text-muted mt-4 dark:text-brand-text-darkMuted">
              Showing page {page} of {totalPages} — {pagination.total} properties
            </p>
          </>
        )}
      </div>
    </div>
  );
}
