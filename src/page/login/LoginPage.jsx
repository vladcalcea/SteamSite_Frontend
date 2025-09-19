import React from "react";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";

const { Title, Text } = Typography;

const LoginPage = () => {
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const onFinish = ({ username, password }) => {
        login(username, password).then(() => {
            if (useAuthStore.getState().isAuthenticated) {
                navigate("/dashboard"); // 👈 smooth redirect
            }
        });
    };

    return (
        <div
            style={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f0f2f5",
            }}
        >
            <Card style={{ width: 400, borderRadius: "8px" }}>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <Title level={2}>Welcome Back</Title>
                    <Text type="secondary">Sign in to your account</Text>
                </div>

                {error && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                <Form onFinish={onFinish} layout="vertical" size="large">
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: "Please input your username!" }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            style={{ width: "100%" }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;
