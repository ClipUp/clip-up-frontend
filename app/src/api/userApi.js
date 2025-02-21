import { useAuthStore } from "../store/userStore";

const API_BASE_URL = "/api";

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

  createUser: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create user");
    return res.json();
  },

  updateUserPwd: async (data) => {
	const accessToken = useAuthStore.getState().accessToken;
	if (!accessToken) throw new Error("Failed to update user pwd: unauthorization");
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/password`, {
      method: "POST",
      headers: {
		"Content-Type": "application/json",
		Authorizaion: `Bearer ${accessToken}`
	},
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update user pwd");
    return res.json();
  },
};
