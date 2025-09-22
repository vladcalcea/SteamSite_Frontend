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

    // 2. Get the logout function from the store
    const { logout } = useAuthStore();

    const sidebarItems = [
        {
            key: "home",
            label: "Home",
            icon: <HomeOutlined />
        },
        {
            key: "dashboard",
            label: "Dashboard",
            icon: <DashboardOutlined />
        },
        {   key: "profile",
            label: "Profile",
            icon: <UserOutlined /> },
    ];

    const userMenuItems = [
        {
            key: "profile",
            label: "Profile",
            icon: <UserOutlined />
        },
        {
            key: "logout",
            label: "Logout",
            icon: <LogoutOutlined />
        },
    ];

    // 3. Update the handler to call logout and then navigate
    const handleUserMenuClick = async ({ key }) => {
        if (key === "logout") {
            await logout();       // Call the async logout from the store
            navigate("/login"); // Redirect after logout is complete
        } else {
            navigate(`/${key}`);
        }
    };

    const currentPath = location.pathname.substring(1) || "home";

    return (
        <div style={{ display: "flex", minHeight: "100vh", width: "100vw" }}>
            {/* Sidebar */}
            <div
                style={{
                    width: isCollapsed ? 80 : 250,
                    backgroundColor: "#001529",
                    transition: "width 0.3s",
                    flexShrink: 0,
                    position: "relative"
                }}
            >
                {/* Logo/Brand area */}
                <div
                    style={{
                        height: 64,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.1)",
                        margin: "16px",
                        borderRadius: "8px"
                    }}
                >
                    {!isCollapsed ? (
                        <h3 style={{ color: "white", margin: 0 }}>Your App</h3>
                    ) : (
                        <div
                            style={{
                                width: 32,
                                height: 32,
                                background: "#1890ff",
                                borderRadius: "50%"
                            }}
                        />
                    )}
                </div>

                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[currentPath]}
                    items={sidebarItems}
                    onClick={({ key }) => {
                        navigate(`/${key}`);
                    }}
                    style={{ border: "none" }}
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

            {/* Main content area */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#f5f5f5",
                    minWidth: 0,
                    minHeight: "100vh",
                    overflow: "hidden"
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
                        zIndex: 1,
                        flexShrink: 0
                    }}
                >
                    <h2 style={{ margin: 0, color: "#001529" }}>
                        {currentPath.charAt(0).toUpperCase() + currentPath.slice(1)}
                    </h2>

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
                            <span style={{ marginLeft: 8 }}>User</span>
                        </div>
                    </Dropdown>
                </div>

                {/* Content (card style) */}
                <div
                    style={{
                        flex: 1,
                        padding: "24px",
                        background: "#fff",
                        overflow: "auto",
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
                        flexShrink: 0
                    }}
                >
                    <span>© 2024 Your App Name. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;