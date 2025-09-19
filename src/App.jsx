import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom"; // ✅ use react-router-dom not react-router
import { ConfigProvider, Spin } from "antd";
import LoginPage from "./page/login/LoginPage";
import Dashboard from "./page/dashboard/Dashboard.jsx";
import ProtectedRoute from "./layout/ProtectedRoute";
import useAuthStore from "./store/useAuthStore.js";
import MainLayout from "./layout/MainLayout.jsx";
import HomePage from "./page/home/HomePage.jsx";
import ProfilePage from "./page/profile/ProfilePage.jsx";
import GamePage from "./page/game/GamePage.jsx";

function App() {
    const { isAuthenticated, initialized, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!initialized) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Checking authentication...</div>
            </div>
        );
    }

    return (
        <ConfigProvider theme={{ token: { colorPrimary: "#1890ff" } }}>
            <Router>
                <Routes>
                    {/* Layout wrapper for all main pages */}
                    <Route element={<MainLayout />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute requiredRole="Admin">
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/profile" element={<ProfilePage />} />
                        {/* ✅ dynamic route for individual game */}
                        <Route path="/games/:id" element={<GamePage />} />
                    </Route>

                    {/* Login */}
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <LoginPage />
                            )
                        }
                    />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/home" replace />} />
                </Routes>
            </Router>
        </ConfigProvider>
    );
}

export default App;
