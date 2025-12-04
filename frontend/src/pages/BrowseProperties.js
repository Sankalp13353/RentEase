import React, { useEffect, useState, useCallback } from "react";
import { fetchHouses } from "../api";
import "./BrowseProperties.css";

const PROPERTY_TYPES = ["Apartment", "Villa", "Independent", "Studio", "Other"];

export default function BrowseProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & search
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");

  // Sorting
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState("desc");

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 5; // number per page
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
      city: city || undefined,
      property_type: propertyType || undefined,
      bedrooms: bedrooms || undefined,
      minRent: minRent || undefined,
      maxRent: maxRent || undefined,
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
  }, [
    debouncedSearch,
    city,
    propertyType,
    bedrooms,
    minRent,
    maxRent,
    sort,
    order,
    page,
    limit,
  ]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const resetFilters = () => {
    setSearch("");
    setCity("");
    setPropertyType("");
    setBedrooms("");
    setMinRent("");
    setMaxRent("");
    setSort("created_at");
    setOrder("desc");
    setPage(1);
  };

  const totalPages = pagination.totalPages || 1;

  return (
    <div className="browse-container">
      <h1>Browse Properties</h1>

      {/* FILTER BAR */}
      <div className="filters">
        {/* SEARCH */}
        <input
          placeholder="Search title, city, address..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* CITY */}
        <input
          placeholder="City"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            setPage(1);
          }}
        />

        {/* PROPERTY TYPE */}
        <select
          value={propertyType}
          onChange={(e) => {
            setPropertyType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* BEDROOMS */}
        <select
          value={bedrooms}
          onChange={(e) => {
            setBedrooms(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Bedrooms</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
          <option value="4">4+</option>
        </select>

        {/* RENT RANGE */}
        <input
          type="number"
          placeholder="Min Rent"
          value={minRent}
          onChange={(e) => {
            setMinRent(e.target.value);
            setPage(1);
          }}
        />

        <input
          type="number"
          placeholder="Max Rent"
          value={maxRent}
          onChange={(e) => {
            setMaxRent(e.target.value);
            setPage(1);
          }}
        />

        {/* SORT */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
        >
          <option value="created_at">Newest</option>
          <option value="rent">Rent</option>
          <option value="title">Title</option>
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

        {/* RESET BUTTON */}
        <button onClick={resetFilters}>Reset</button>
      </div>

      {/* PROPERTY LIST */}
      {loading ? (
        <p>Loading properties...</p>
      ) : properties.length === 0 ? (
        <p>No properties match your search.</p>
      ) : (
        <>
          <div className="browse-list">
            {properties.map((house) => (
              <div key={house.id} className="browse-card">
                <h3>{house.title}</h3>

                <p>
                  {house.address}, {house.city}
                </p>

                <p>
                  <strong>Rent:</strong> ₹{house.rent || "N/A"}
                </p>
                <p>
                  <strong>Bedrooms:</strong> {house.bedrooms}
                </p>
                <p>
                  <strong>Bathrooms:</strong> {house.bathrooms}
                </p>

                <button
                  className="details-btn"
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
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  className={p === page ? "active" : ""}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>

          <p className="page-info">
            Showing page {page} of {totalPages} — {pagination.total} properties
          </p>
        </>
      )}
    </div>
  );
}
