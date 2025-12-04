// src/api.js
import axios from "axios";

/* ---------------------------------------------------
   BASE URL (LOCAL + PRODUCTION)
--------------------------------------------------- */
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL || "http://localhost:5001";

/* ---------------------------------------------------
   AXIOS INSTANCE (baseApi)
--------------------------------------------------- */
const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===================================================
   🔹 USER AUTH & PROFILE APIs
=================================================== */
export const signupUser = async (userData) => {
  try {
    const res = await baseApi.post("/api/users/register", userData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await baseApi.post("/api/users/login", credentials);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const getProfile = async () => {
  try {
    const res = await baseApi.get("/api/users/me");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await baseApi.put("/api/users/update", data);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 PROJECT APIs
=================================================== */
export const createProject = async (projectData) => {
  try {
    const res = await baseApi.post("/api/projects/create", projectData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const getMyProjects = async () => {
  try {
    const res = await baseApi.get("/api/projects/client/me");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const fetchProjects = async () => {
  try {
    const res = await baseApi.get("/api/projects");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const fetchProjectById = async (id) => {
  try {
    const res = await baseApi.get(`/api/projects/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 APPLICATION APIs
=================================================== */
export const applyToProject = async ({ projectId, proposal, bid_amount }) => {
  try {
    const res = await baseApi.post("/api/applications/apply", {
      projectId,
      proposal,
      bid_amount,
    });
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const getAppliedProjects = async () => {
  try {
    const res = await baseApi.get("/api/applications/me");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const withdrawApplication = async (applicationId) => {
  try {
    const res = await baseApi.delete(`/api/applications/${applicationId}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const getFreelancersForProject = async (projectId) => {
  try {
    const res = await baseApi.get(`/api/applications/project/${projectId}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 HOUSES / PROPERTIES APIs
=================================================== */

// CREATE HOUSE
export const createHouse = async (houseData) => {
  try {
    const res = await baseApi.post("/api/houses/create", houseData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// FETCH PUBLIC HOUSES (supports filters, sorting, pagination)
export const fetchHouses = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });

    const qs = query.toString();
    const res = await baseApi.get(`/api/houses${qs ? `?${qs}` : ""}`);

    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// FETCH HOUSE BY ID
export const fetchHouseById = async (id) => {
  try {
    const res = await baseApi.get(`/api/houses/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// UPDATE HOUSE
export const updateHouse = async (id, houseData) => {
  try {
    const res = await baseApi.put(`/api/houses/${id}`, houseData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// DELETE HOUSE
export const deleteHouse = async (id) => {
  try {
    const res = await baseApi.delete(`/api/houses/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 OWNER HOUSES — with filters, sort, pagination
=================================================== */

export const fetchOwnerHouses = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value);
      }
    });

    const qs = query.toString();
    const res = await baseApi.get(`/api/houses/my-properties${qs ? `?${qs}` : ""}`);

    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 TENANT INTEREST APIs
=================================================== */

// Tenant shows interest in a house
export const showInterest = async ({ houseId, message }) => {
  try {
    const res = await baseApi.post("/api/interests", { houseId, message });
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// Fetch logged-in tenant's interest list
export const fetchMyInterests = async () => {
  try {
    const res = await baseApi.get("/api/interests/my-interests");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// Cancel tenant interest
export const cancelInterest = async (interestId) => {
  try {
    const res = await baseApi.delete(`/api/interests/${interestId}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   🔹 OWNER — Incoming Interests (Approve / Reject)
=================================================== */

// Owner views all incoming interests
export const fetchOwnerInterests = async () => {
  try {
    const res = await baseApi.get("/api/interests/owner");
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// Owner approves interest (reveals email)
export const approveInterest = async (interestId) => {
  try {
    const res = await baseApi.patch(`/api/interests/${interestId}/approve`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

// Owner rejects interest
export const rejectInterest = async (interestId) => {
  try {
    const res = await baseApi.patch(`/api/interests/${interestId}/reject`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

/* ===================================================
   Export Axios instance
=================================================== */
export default baseApi;
