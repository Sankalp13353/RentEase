import React, { useEffect, useState, useCallback } from "react";
import { fetchOwnerHouses, deleteHouse } from "../api";
import { Link } from "react-router-dom";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent", "Studio", "Other"];

export default function OwnerMyProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");


  const [page, setPage] = useState(1);
  const limit = 5;

  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });


  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch || undefined,
        property_type: propertyType || undefined,
        sort,
        order,
        page,
        limit
      };

      const res = await fetchOwnerHouses(params);

      if (res.ERROR) {
        console.error("API error:", res.ERROR);
        setProperties([]);
        setPagination({ total: 0, totalPages: 0 });
      } else {
        setProperties(res.houses || []);
        setPagination(res.pagination || { total: 0, totalPages: 0 });
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, propertyType, sort, order, page]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    const res = await deleteHouse(id);

    if (!res.ERROR) {
      loadProperties();
    }
  };

  const handleResetFilters = () => {
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

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text-main dark:text-brand-text-dark">My Properties</h1>
          <Link to="/dashboard" className="text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>
        </div>

        {}
        <div className="flex flex-wrap gap-4 mb-8 items-center bg-brand-surface-light p-5 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 dark:bg-brand-surface-dark dark:border-white/5 dark:shadow-none">

          {}
          <input
            placeholder="Search title, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />


          {}
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black">

            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) =>
            <option key={t} value={t}>{t}</option>
            )}
          </select>

          {}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black">

            <option value="created_at">Sort: Newest</option>
            <option value="rent">Sort: Rent</option>
            <option value="title">Sort: Title</option>
          </select>

          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
            className="p-2.5 border border-gray-200 rounded-xl shadow-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black">

            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition text-sm font-medium dark:bg-white/10 dark:text-white dark:hover:bg-white/20">

            Reset
          </button>
        </div>

        {}
        {loading ?
        <p className="text-brand-text-muted dark:text-brand-text-darkMuted text-center py-10">Loading...</p> :
        properties.length === 0 ?
        <p className="text-brand-text-muted dark:text-brand-text-darkMuted text-center py-10">No properties found.</p> :

        <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
              {properties.map((house) =>
            <div key={house.id} className="bg-brand-surface-light p-6 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition hover:shadow-lg border border-transparent dark:bg-brand-surface-dark dark:backdrop-blur-md dark:border-white/5 dark:shadow-none dark:hover:bg-white/5">
                  <h3 className="text-xl font-bold mb-2 text-brand-text-main dark:text-brand-text-dark truncate">{house.title}</h3>
                  <p className="text-sm text-brand-text-muted my-1 dark:text-brand-text-darkMuted">{house.address}, {house.city}</p>
                  <div className="my-3 border-t border-gray-100 dark:border-white/10"></div>
                  <p className="text-brand-text-main font-semibold my-1 dark:text-brand-text-dark">Expected Rent: <span className="text-brand-primary dark:text-brand-secondary">₹{house.rent || "N/A"}</span></p>

                  <div className="flex gap-3 mt-5">
                    <button
                  onClick={() => handleDelete(house.id)}
                  className="w-full px-4 py-2.5 bg-red-500/10 text-red-600 border border-red-200 rounded-xl hover:bg-red-500/20 hover:border-red-300 transition font-medium dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30 dark:hover:bg-red-500/30">

                      Delete Property
                    </button>
                  </div>
                </div>
            )}
            </div>

            {}
            <div className="flex gap-2 mt-12 items-center justify-center">
              <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-brand-surface-light border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">

                Previous
              </button>

              {}
              {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${p === page ? "bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/30 dark:bg-brand-secondary dark:text-brand-surface-dark dark:border-brand-secondary" : "bg-brand-surface-light border-gray-200 hover:bg-gray-50 dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"}`}>

                    {p}
                  </button>);

            })}

              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-brand-surface-light border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 text-sm font-medium dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10">
                Next
              </button>
            </div>

            <p className="text-center text-sm text-brand-text-muted mt-4 dark:text-brand-text-darkMuted">
              Page {page} of {totalPages} — {pagination.total} items
            </p>
          </>
        }
      </div>
    </div>);

}