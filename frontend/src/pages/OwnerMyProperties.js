// src/pages/OwnerMyProperties.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./OwnerMyProperties.css";

import { fetchOwnerHouses, deleteHouse } from "../api";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent", "Studio", "Other"];

export default function OwnerMyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & sorting
  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5; // FIXED PAGE SIZE (AS YOU REQUESTED)

  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

  // debounce search
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
        limit, // always 5
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

  // Pagination button logic
  const totalPages = pagination.totalPages || 1;

  return (
    <div className="my-properties-container">
      <h1>My Properties</h1>

      {/* FILTERS ROW */}
      <div className="controls">
        <div className="control-row">

          {/* Search Input */}
          <input
            placeholder="Search title, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="search-input"
          />

          {/* REMOVE CITY FIELD — removed */}

          {/* Property Type */}
          <select
            value={propertyType}
            onChange={(e) => {
              setPropertyType(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {/* REMOVE STATUS FILTER — removed */}

          {/* Sorting */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
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
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          {/* REMOVE PAGE SIZE DROPDOWN — removed */}

          <button onClick={handleResetFilters}>Reset</button>
        </div>
      </div>

      {/* LIST VIEW */}
      {loading ? (
        <p>Loading...</p>
      ) : properties.length === 0 ? (
        <p>No properties found.</p>
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

          {/* PAGINATION */}
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            {/* Show page numbers */}
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={p === page ? "active" : ""}
                >
                  {p}
                </button>
              );
            })}

            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>

            <div style={{ marginLeft: 12 }}>
              <small>
                Page {page} of {totalPages} — {pagination.total} items
              </small>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
