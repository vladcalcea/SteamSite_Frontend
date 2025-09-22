import React, { useState } from "react";
import { Form, Input, Button, Card, Alert, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore.js";
import API from "../../api/axios";

const { Title, Text } = Typography;

const LoginPage = () => {
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.loading);
    const error = useAuthStore((state) => state.error);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    const [showRegister, setShowRegister] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");

    const onFinish = ({ username, password }) => {
        login(username, password).then(() => {
            if (useAuthStore.getState().isAuthenticated) {
                navigate("/dashboard");
            }
        });
    };

    const onRegister = async (values) => {
        setRegisterLoading(true);
        setRegisterError("");
        setRegisterSuccess("");
        try {
            const res = await API.post("/api/auth/register", values);
            if (res.status === 201 || res.status === 200) {
                setRegisterSuccess("Account created! You can now log in.");
                setShowRegister(false);
            } else {
                setRegisterError(res.data?.error || "Registration failed.");
            }
        } catch (err) {
            setRegisterError(err.response?.data?.error || "Registration failed.");
        } finally {
            setRegisterLoading(false);
        }
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
                    <Title level={2}>{showRegister ? "Create Account" : "Welcome Back"}</Title>
                    <Text type="secondary">
                        {showRegister ? "Sign up for a new account" : "Sign in to your account"}
                    </Text>
                </div>

                {error && !showRegister && (
                    <Alert
                        message={error}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                {registerError && showRegister && (
                    <Alert
                        message={registerError}
                        type="error"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}
                {registerSuccess && showRegister && (
                    <Alert
                        message={registerSuccess}
                        type="success"
                        showIcon
                        style={{ marginBottom: 16 }}
                    />
                )}

                {!showRegister ? (
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
                        <div style={{ textAlign: "center" }}>
                            <Text type="secondary">
                                Don't have an account?{' '}
                                <Button type="link" onClick={() => setShowRegister(true)} style={{ padding: 0 }}>
                                    Register
                                </Button>
                            </Text>
                        </div>
                    </Form>
                ) : (
                    <Form onFinish={onRegister} layout="vertical" size="large">
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: "Please input your username!" }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            rules={[
                                { required: true, message: "Please input your email!" },
                                { type: "email", message: "Please enter a valid email!" }
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: "Please input your password!" }]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>
                        <Form.Item
                            name="confirmPassword"
                            dependencies={["password"]}
                            rules={[
                                { required: true, message: "Please confirm your password!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Passwords do not match!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={registerLoading}
                                style={{ width: "100%" }}
                            >
                                {registerLoading ? "Registering..." : "Register"}
                            </Button>
                        </Form.Item>
                        <div style={{ textAlign: "center" }}>
                            <Text type="secondary">
                                Already have an account?{' '}
                                <Button type="link" onClick={() => setShowRegister(false)} style={{ padding: 0 }}>
                                    Sign In
                                </Button>
                            </Text>
                        </div>
                    </Form>
                )}
            </Card>
        </div>
    );
};

export default LoginPage;
