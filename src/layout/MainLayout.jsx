import React, { useState } from "react";
import { Menu, Button, Avatar, Dropdown } from "antd";
import { useNavigate, Outlet, useLocation } from "react-router";
import {
    HomeOutlined,
    DashboardOutlined,
    UserOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined
} from "@ant-design/icons";
import useAuthStore from "../store/useAuthStore";

const MainLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { logout, username, role, isAuthenticated } = useAuthStore();

    const getSidebarItems = () => {
        const baseItems = [
            {
                key: "home",
                label: "Home",
                icon: <HomeOutlined />
            }
        ];

        if (isAuthenticated && role === "Admin") {
            baseItems.push({
                key: "dashboard",
                label: "Dashboard",
                icon: <DashboardOutlined />
            });
        }

        if (isAuthenticated) {
            baseItems.push(
                {
                    key: "profile",
                    label: "Profile",
                    icon: <UserOutlined />
                },
                {
                    key: "friends",
                    label: "Friends",
                    icon: <UserOutlined />
                }
            );
        }

        return baseItems;
    };

    const userMenuItems = [
        { key: "profile", label: "Profile", icon: <UserOutlined /> },
        { key: "logout", label: "Logout", icon: <LogoutOutlined /> }
    ];

    const handleUserMenuClick = async ({ key }) => {
        if (key === "logout") {
            await logout();
            navigate("/login");
        } else {
            navigate(`/${key}`);
        }
    };

    const currentPath = location.pathname.substring(1) || "home";

    return (
        <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
            {/* Sidebar (fixed) */}
            <div
                style={{
                    width: isCollapsed ? 80 : 250,
                    backgroundColor: "#001529",
                    transition: "width 0.3s",
                    flexShrink: 0,
                    position: "fixed",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    height: "100vh",
                    overflow: "hidden",
                    zIndex: 1000 // High zIndex to keep sidebar on top
                }}
            >
                {/* Logo/Brand area */}
                <div
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "white",
                        margin: "16px",
                        borderRadius: "8px",
                        overflow: "hidden"
                    }}
                >
                    <img
                        src="/Logo.svg"
                        alt="SPLURGE Logo"
                        style={{ height: isCollapsed ? 32 : 40, objectFit: "contain" }}
                    />
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[currentPath]}
                    items={getSidebarItems()}
                    onClick={({ key }) => {
                        navigate(`/${key}`);
                    }}
                    style={{ border: "none" }}
                    inlineCollapsed={isCollapsed}
                />

                {/* Collapse button */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 20,
                        left: isCollapsed ? 20 : 200,
                        transition: "left 0.3s"
                    }}
                >
                    <Button
                        type="text"
                        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        style={{ color: "white" }}
                    />
                </div>
            </div>


            {/* Main content area (shifted to the right of sidebar) */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    // Use a subtle background, but the GamePage will manage the main viewport background
                    backgroundColor: "#f5f5f5",
                    minWidth: 0,
                    minHeight: "100vh",
                    marginLeft: isCollapsed ? 80 : 250, // Offset for fixed sidebar
                    transition: "margin-left 0.3s",
                    overflow: "hidden" // Keep this for overall layout integrity
                }}
            >
                {/* Header */}
                <div
                    style={{
                        height: 64,
                        background: "#fff",
                        padding: "0 24px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 10, // Ensure header floats above GamePage fixed elements
                        flexShrink: 0
                    }}
                >
                    <h2 style={{ margin: 0, color: "#001529" }}>
                        {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
                    </h2>

                    {isAuthenticated ? (
                        <Dropdown
                            menu={{
                                items: userMenuItems,
                                onClick: handleUserMenuClick
                            }}
                            placement="bottomRight"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    padding: "8px 12px",
                                    borderRadius: "8px"
                                }}
                            >
                                <Avatar size={32} icon={<UserOutlined />} />
                                <span style={{ marginLeft: 8 }}>
                                    {username || "User"}
                                    {role === "Admin" && (
                                        <span
                                            style={{
                                                marginLeft: 4,
                                                fontSize: "12px",
                                                color: "#1890ff"
                                            }}
                                        >
                                            (Admin)
                                        </span>
                                    )}
                                </span>
                            </div>
                        </Dropdown>
                    ) : (
                        <Button type="primary" onClick={() => navigate("/login")}>
                            Sign In
                        </Button>
                    )}
                </div>

                {/* Content - CRITICAL CHANGES HERE */}
                <div
                    style={{
                        flex: 1,
                        padding: "0", // 🛑 Set padding to 0. GamePage manages its own spacing via __wrapper class.
                        background: "transparent", // 🛑 Set background to transparent to allow GamePage styles to show.
                        overflow: "visible", // 🛑 Allow child content (GamePage) to manage its own scrolling/fixed elements.
                        width: "100%",
                        minHeight: 0
                    }}
                >
                    <Outlet />
                </div>

                {/* Footer */}
                <div
                    style={{
                        textAlign: "center",
                        background: "transparent",
                        color: "#666",
                        padding: "12px 24px",
                        flexShrink: 0,
                        zIndex: 10 // Ensure footer floats above GamePage fixed elements
                    }}
                >
                    <span>© 2025 SPLURGE. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;