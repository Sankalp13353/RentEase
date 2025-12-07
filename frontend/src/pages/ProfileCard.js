import React, { useState } from "react";

const ProfileCard = ({ user, onClose }) => {
  const [editMode, setEditMode] = useState(false);

  // Form state (email included only for display, NOT update)
  const [form, setForm] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "", // shown but NOT editable
    age: user?.age || "",
    gender: user?.gender || "",
    city: user?.city || "",
    experience: user?.experience || "",
    organization: user?.organization || "",
    aboutOrg: user?.aboutOrg || "",
    skills: user?.skills || "",
    portfolio_url: user?.portfolio_url || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ======================================================
        SAVE PROFILE (ONLY allowed fields sent)
  ====================================================== */
  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    // Build allowed payload
    const allowedData = {
      name: form.name,
      username: form.username,
      age: form.age,
      gender: form.gender,
      city: form.city,
      experience: form.experience,
      organization: form.organization,
      aboutOrg: form.aboutOrg,
      skills: form.skills,
      portfolio_url: form.portfolio_url,
    };

    // Remove empty / undefined values
    Object.keys(allowedData).forEach((key) => {
      if (!allowedData[key]) delete allowedData[key];
    });

    try {
      const response = await fetch("http://localhost:5001/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(allowedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return alert(data.ERROR || "Failed to update profile");
      }

      alert("Profile updated successfully!");

      // Update UI data instantly
      Object.assign(user, allowedData);

      setEditMode(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while saving.");
    }
  };

  /* ======================================================
        CANCEL BUTTON → Reset form
  ====================================================== */
  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      age: user?.age || "",
      gender: user?.gender || "",
      city: user?.city || "",
      experience: user?.experience || "",
      organization: user?.organization || "",
      aboutOrg: user?.aboutOrg || "",
      skills: user?.skills || "",
      portfolio_url: user?.portfolio_url || "",
    });

    setEditMode(false);
  };

  return (
    <div className="fixed inset-0 bg-black/55 backdrop-blur-sm flex justify-center items-center z-[2000]">
      <div className="w-[360px] bg-white/10 backdrop-blur-[15px] border border-white/20 rounded-2xl p-6 text-white shadow-[0_10px_35px_rgba(0,0,0,0.3)] relative animate-fadeIn">
        {/* CLOSE BUTTON */}
        <button
          className="absolute right-3 top-3 bg-white/25 text-white text-sm py-1.5 px-2.5 rounded-md cursor-pointer border-none transition hover:bg-white/35"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-white">My Profile</h2>

        {/* ======================================================
            VIEW MODE
        ====================================================== */}
        {!editMode ? (
          <>
            <div className="space-y-2 text-[15px]">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Username:</strong> {user?.username}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>

              {/* FREELANCER VIEW */}
              {user?.role === "freelancer" && (
                <>
                  {user.age && <p><strong>Age:</strong> {user.age}</p>}
                  {user.gender && <p><strong>Gender:</strong> {user.gender}</p>}
                  {user.city && <p><strong>City:</strong> {user.city}</p>}
                  {user.experience && (
                    <p><strong>Experience:</strong> {user.experience} years</p>
                  )}
                  {user.skills && <p><strong>Skills:</strong> {user.skills}</p>}
                  {user.portfolio_url && (
                    <p>
                      <strong>Portfolio:</strong>{" "}
                      <a href={user.portfolio_url} target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-200 underline">
                        View
                      </a>
                    </p>
                  )}
                </>
              )}

              {/* CLIENT VIEW */}
              {user?.role === "client" && (
                <>
                  {user.organization && (
                    <p><strong>Organization:</strong> {user.organization}</p>
                  )}
                  {user.aboutOrg && (
                    <p><strong>About Org:</strong> {user.aboutOrg}</p>
                  )}
                </>
              )}
            </div>

            <button
              className="mt-4 w-full p-2.5 bg-blue-500 text-white border-none rounded-lg cursor-pointer transition hover:bg-blue-600"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            {/* ======================================================
                EDIT MODE
            ====================================================== */}
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Username</label>
                <input name="username" value={form.username} onChange={handleChange} className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50" />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email (not editable)</label>
                <input value={form.email} disabled className="w-full p-2.5 bg-white/10 border-none rounded-lg text-gray-300 cursor-not-allowed" />
              </div>

              {/* FREELANCER FIELDS */}
              {user?.role === "freelancer" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Gender</label>
                    <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50 [&>option]:text-black">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={form.experience}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Skills (comma separated)</label>
                    <input
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Portfolio URL</label>
                    <input
                      name="portfolio_url"
                      value={form.portfolio_url}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>
                </>
              )}

              {/* CLIENT FIELDS */}
              {user?.role === "client" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Organization Name</label>
                    <input
                      name="organization"
                      value={form.organization}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">About Organization</label>
                    <textarea
                      name="aboutOrg"
                      value={form.aboutOrg}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white/20 border-none rounded-lg text-white outline-none focus:ring-1 focus:ring-white/50 h-20 resize-none"
                    />
                  </div>
                </>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex justify-between mt-5 pt-2 border-t border-white/10">
              <button
                className="bg-emerald-500 text-white px-4 py-2 rounded-lg border-none hover:bg-emerald-600 transition"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg border-none hover:bg-red-600 transition"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
