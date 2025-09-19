import { create } from "zustand";

const API_URL = "http://localhost:5012"; // your backend URL

const useAuthStore = create((set) => ({
    isAuthenticated: false,
    username: null,
    role: null,
    loading: false,
    error: null,
    initialized: false, // track if checkAuth already ran

    // 🔑 Login (cookie gets set by backend)
    login: async (username, password) => {
        set({ loading: true, error: null });
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
                credentials: "include", // include cookies
            });

            if (!res.ok) {
                throw new Error("Invalid username or password");
            }

            // After login, fetch user info
            await useAuthStore.getState().checkAuth();
        } catch (err) {
            set({ error: err.message });
        } finally {
            set({ loading: false });
        }
    },

    // 🔑 Logout (cookie cleared server-side)
    logout: async () => {
        try {
            await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout failed", err);
        } finally {
            set({ isAuthenticated: false, username: null, role: null });
        }
    },

    // 🔑 Check if user is authenticated (run on app load)
    checkAuth: async () => {
        try {
            const res = await fetch(`${API_URL}/api/auth/me`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Not authenticated");
            }

            const data = await res.json();

            set({
                isAuthenticated: true,
                username: data.username,
                role: data.role,
                initialized: true,
            });
        } catch {
            set({
                isAuthenticated: false,
                username: null,
                role: null,
                initialized: true,
            });
        }
    },
}));

export default useAuthStore;
