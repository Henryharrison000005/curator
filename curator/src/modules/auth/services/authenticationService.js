import axios from "axios";

const API_BACKEND = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export const backend = axios.create({
  baseURL: API_BACKEND,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
  timeout: 10000,
});

backend.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (
      !config.url.includes("/login") &&
      !config.url.includes("/register") &&
      token
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

backend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authEndpoints = ["/api/login", "/api/register", "/api/refresh"];

    // Ignore login/register errors (do NOT refresh)
    if (authEndpoints.some((ep) => originalRequest.url.includes(ep))) {
      return Promise.reject(error);
    }

    // Token expired → refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await backend.post("/api/refresh");
        const newToken = res.data.token;

        localStorage.setItem("token", newToken);
        backend.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

        return backend(originalRequest);
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/Login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


const login = async (credentials) => {
  const { data } = await backend.post("/api/login", credentials);
  if (!data.success) {
    throw new Error(data.message || "Invalid login");
  }
  return data;
};

// PATCH API to update user phone number
const updateStudentPhone = async ({ userId, phone_no }) => {
  return await backend.patch(`/api/updateUserProfile/${userId}`, {
    phone_no,
  });
};

// Generic PATCH to update the authenticated user's profile fields
const updateUserProfile = async (userId, payload) => {
  return await backend.patch(`/api/updateUserProfile/${userId}`, payload);
};

// Download the authenticated user's own data
const downloadMyData = async () => {
  const { data } = await backend.get("/api/myData");
  return data;
};

// Deactivate the authenticated user's account
const deactivateAccount = async () => {
  const { data } = await backend.post("/api/deactivateAccount");
  return data;
};

const register = async (credentials) => {
  const { data } = await backend.post("/api/register", credentials);
  return data;
};

// Invalidate the current JWT on the backend
const logout = async () => {
  const { data } = await backend.post("/api/logout");
  return data;
};

// // Fetch all students for instructor department management
// const fetchAllStudents = async () => {
//   const { data } = await backend.get("/api/getAllStudents");
//   return data;
// };

// // Fetch all departments for dropdown selection
// const fetchAllDepartments = async () => {
//   const { data } = await backend.get("/api/getAllDepartments");
//   return data;
// };

// // Update student's department
// const updateStudentDepartment = async (studentId, departmentData) => {
//   const { data } = await backend.patch(
//     `/api/updateStudentDepartment/${studentId}`,
//     departmentData
//   );
//   return data;
// };

export { login, register, logout, updateStudentPhone, updateUserProfile, downloadMyData, deactivateAccount };