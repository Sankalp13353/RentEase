import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OwnerAddProperty.css";

const OwnerAddProperty = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    property_type: "Apartment",
    bedrooms: "",
    bathrooms: "",
    area_sqft: "",
    rent: "",
    available_from: "",
    amenities: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to add a property");
      setLoading(false);
      return;
    }

    // Prepare payload with correct types
    const payload = {
      ...formData,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
      area_sqft: formData.area_sqft ? Number(formData.area_sqft) : 0,
      rent: formData.rent ? Number(formData.rent) : null,
      available_from: formData.available_from
        ? new Date(formData.available_from)
        : null,
    };

    try {
      const res = await axios.post(
        "https://freelancehub-1efa.onrender.com/api/houses/create",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Property added successfully!");
      navigate("/my-properties"); // redirect to owner's properties
    } catch (err) {
      console.error("Add property failed:", err.response?.data || err.message);
      setError(err.response?.data?.ERROR || "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="owner-add-property">
      <h2>Add New Property</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input name="title" value={formData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} />

        <label>Address:</label>
        <input name="address" value={formData.address} onChange={handleChange} required />

        <label>City:</label>
        <input name="city" value={formData.city} onChange={handleChange} required />

        <label>State:</label>
        <input name="state" value={formData.state} onChange={handleChange} required />

        <label>Zipcode:</label>
        <input name="zipcode" value={formData.zipcode} onChange={handleChange} required />

        <label>Property Type:</label>
        <select name="property_type" value={formData.property_type} onChange={handleChange}>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Independent">Independent</option>
          <option value="Studio">Studio</option>
          <option value="Other">Other</option>
        </select>

        <label>Bedrooms:</label>
        <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} />

        <label>Bathrooms:</label>
        <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} />

        <label>Area (sqft):</label>
        <input name="area_sqft" type="number" value={formData.area_sqft} onChange={handleChange} />

        <label>Rent:</label>
        <input name="rent" type="number" value={formData.rent} onChange={handleChange} />

        <label>Available From:</label>
        <input name="available_from" type="date" value={formData.available_from} onChange={handleChange} />

        <label>Amenities:</label>
        <input name="amenities" value={formData.amenities} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Property"}
        </button>
      </form>
    </div>
  );
};

export default OwnerAddProperty;
