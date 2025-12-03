// src/pages/OwnerMyProperties.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerMyProperties.css";

import { fetchOwnerHouses, deleteHouse } from "../api";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent", "Studio", "Other"];
const STATUS_OPTIONS = ["ForSale", "Sold", "Completed"];
const SORT_OPTIONS = [
  { value: "created_at", label: "Newest" },
  { value: "created_at", label: "Oldest", invertOrder: true },
  { value: "rent", label: "Rent (low → high)" },
  { value: "rent", label: "Rent (high → low)", invertOrder: true },
  { value: "title", label: "Title (A → Z)" },
  { value: "title", label: "Title (Z → A)", invertOrder: true },
];

export default function OwnerMyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters / sort / pagination state
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  // debounce for search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch || undefined,
        city: city || undefined,
        property_type: propertyType || undefined,
        status: status || undefined,
        sort,
        order,
        page,
        limit,
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
      console.error("Load properties error:", err);
      setProperties([]);
      setPagination({ total: 0, totalPages: 0 });
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, city, propertyType, status, sort, order, page, limit]);

  // Reload when filters / page / limit / sort / debouncedSearch change
  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    const res = await deleteHouse(id);
    if (res.ERROR) {
      console.error("Delete failed:", res.ERROR);
      return;
    }

    // If current page becomes empty after delete, move one page back if possible
    const newTotal = pagination.total - 1;
    const newTotalPages = Math.max(1, Math.ceil(newTotal / limit));
    if (page > newTotalPages) {
      setPage(newTotalPages);
    } else {
      // reload current page
      loadProperties();
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setCity("");
    setPropertyType("");
    setStatus("");
    setSort("created_at");
    setOrder("desc");
    setPage(1);
    setLimit(10);
  };

  // create page numbers array (bounded)
  const pageNumbers = [];
  const totalPages = pagination.totalPages || 1;
  const maxButtons = 7;
  let start = Math.max(1, page - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>

      <div className="controls">
        <div className="control-row">
          <input
            placeholder="Search title, address, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="search-input"
          />

          <input
            placeholder="City"
            value={city}
            onChange={(e) => { setCity(e.target.value); setPage(1); }}
            className="small-input"
          />

          <select
            value={propertyType}
            onChange={(e) => { setPropertyType(e.target.value); setPage(1); }}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          >
            <option value="">All Status</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="control-row">
          <select
            value={sort}
            onChange={(e) => {
              const selected = e.target.value;
              setSort(selected);
              // default order depending on selected
              setOrder(selected === "title" ? "asc" : "desc");
              setPage(1);
            }}
          >
            <option value="created_at">Sort: Newest</option>
            <option value="rent">Sort: Rent</option>
            <option value="title">Sort: Title</option>
            <option value="city">Sort: City</option>
          </select>

          <select
            value={order}
            onChange={(e) => { setOrder(e.target.value); setPage(1); }}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <label>
            Page size:
            <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button onClick={handleResetFilters}>Reset</button>
        </div>
      </div>

      {loading ? (
        <p>Loading your properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties match your filters.</p>
      ) : (
        <>
          <div className="properties-list">
            {properties.map((house) => (
              <div key={house.id} className="property-card">
                <h3>{house.title}</h3>
                <p>{house.address}, {house.city}</p>
                <p><strong>Rent:</strong> ₹{house.rent || "N/A"}</p>

                <div className="property-actions">
                  <button onClick={() => handleDelete(house.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            {start > 1 && (
              <>
                <button onClick={() => setPage(1)}>1</button>
                {start > 2 && <span>…</span>}
              </>
            )}

            {pageNumbers.map((pNum) => (
              <button
                key={pNum}
                onClick={() => setPage(pNum)}
                className={pNum === page ? "active" : ""}
              >
                {pNum}
              </button>
            ))}

            {end < totalPages && (
              <>
                {end < totalPages - 1 && <span>…</span>}
                <button onClick={() => setPage(totalPages)}>{totalPages}</button>
              </>
            )}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>

            <div style={{ marginLeft: 12 }}>
              <small>
                Page {page} / {totalPages} — {pagination.total} items
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
