import { API_BASE_URL, fetchWithAuth } from "./fetchUtils";

export const userAPI = {
  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  autoLogin: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
    });
    if (!res.ok) throw new Error("Failed to autoLogin");
    return res.json();
  },

  register: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  updateUserPwd: async (data) => {
    const res = fetchWithAuth("/api/v1/auth/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },
};
