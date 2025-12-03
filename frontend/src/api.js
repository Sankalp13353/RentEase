// src/api.js
import axios from "axios";

/* ---------------------------------------------------
   BASE URL (LOCAL + PRODUCTION)
--------------------------------------------------- */
const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BACKEND_SERVER_URL
    : process.env.REACT_APP_BACKEND_LOCAL_URL
    || "http://localhost:5001" ;

/* ---------------------------------------------------
   SINGLE AXIOS INSTANCE (base API URL) + AUTO TOKEN
   Use this instance for all endpoints under API_BASE_URL
--------------------------------------------------- */
const baseApi = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// attach token automatically
baseApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===================================================
   🔹 USER AUTH & PROFILE (paths under /api/users)
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
   🔹 PROJECT APIs  (/api/projects)
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
   🔹 APPLICATION APIs (/api/applications)
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
   🔹 HOUSES / PROPERTIES APIs (/api/houses)
   (added — used by OwnerAddProperty component)
=================================================== */
export const createHouse = async (houseData) => {
  try {
    const res = await baseApi.post("/api/houses/create", houseData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const fetchHouses = async (query = "") => {
  try {
    // optional query string
    const res = await baseApi.get(`/api/houses${query ? `?${query}` : ""}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const fetchHouseById = async (id) => {
  try {
    const res = await baseApi.get(`/api/houses/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const updateHouse = async (id, houseData) => {
  try {
    const res = await baseApi.put(`/api/houses/${id}`, houseData);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};

export const deleteHouse = async (id) => {
  try {
    const res = await baseApi.delete(`/api/houses/${id}`);
    return res.data;
  } catch (err) {
    return err.response?.data || { ERROR: "Network error" };
  }
};


/* ===================================================
   Export default (optional)
=================================================== */
export default baseApi;
