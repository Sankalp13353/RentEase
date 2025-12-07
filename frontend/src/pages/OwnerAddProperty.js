import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createHouse } from "../api";

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
    available_from: ""
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

    const payload = {
      title: formData.title,
      description: formData.description || null,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipcode: formData.zipcode,
      property_type: formData.property_type,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      area_sqft: Number(formData.area_sqft) || 0,
      rent: formData.rent ? Number(formData.rent) : null,
      available_from: formData.available_from || null
    };

    const response = await createHouse(payload);

    if (response.ERROR) {
      setError(response.ERROR);
      setLoading(false);
      return;
    }

    alert("Property added successfully!");
    navigate("/my-properties");
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-brand-light text-brand-text-main duration-300 dark:bg-brand-dark dark:text-brand-text-dark flex justify-center items-start">
      <div className="w-full max-w-3xl">
        <Link to="/dashboard" className="block mb-6 text-brand-primary font-medium hover:underline dark:text-brand-secondary">← Back to Dashboard</Link>

        <div className="bg-brand-surface-light p-8 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-transparent dark:bg-brand-surface-dark dark:shadow-none dark:border-white/5 backdrop-blur-md">
          <h2 className="text-center text-3xl font-bold mb-8 text-brand-text-main dark:text-brand-text-dark">Add New Property</h2>
          {error && <p className="text-red-500 text-center mb-6 font-medium bg-red-50 p-3 rounded-lg dark:bg-red-900/20">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Property Title</label>
              <input name="title" value={formData.title} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" placeholder="e.g. Luxury Apartment in Downtown" />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 min-h-[120px] resize-y bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" placeholder="Describe the key features..." />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Address</label>
              <input name="address" value={formData.address} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">City</label>
                <input name="city" value={formData.city} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">State</label>
                <input name="state" value={formData.state} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Zipcode</label>
                <input name="zipcode" value={formData.zipcode} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Property Type</label>
              <select name="property_type" value={formData.property_type} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary [&>option]:text-black">
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Independent">Independent</option>
                <option value="Studio">Studio</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Bedrooms</label>
                <input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Bathrooms</label>
                <input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Area (sqft)</label>
                <input name="area_sqft" type="number" value={formData.area_sqft} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Rent (₹)</label>
                <input name="rent" type="number" value={formData.rent} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary" />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-brand-text-main dark:text-brand-text-dark">Available From</label>
                <input name="available_from" type="date" value={formData.available_from} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-brand-secondary dark:[color-scheme:dark]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full p-4 bg-brand-primary text-white font-bold rounded-xl hover:bg-brand-accent transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-primary/30 dark:bg-brand-secondary dark:text-brand-surface-dark dark:hover:bg-white dark:shadow-none">

              {loading ? "Adding Property..." : "Add Property"}
            </button>
          </form>
        </div>
      </div>
    </div>);

};

export default OwnerAddProperty;