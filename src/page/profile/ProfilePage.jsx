import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Card, Tabs, List, Spin, message, Button, Form, Input, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import API from "../../api/axios";
import { useParams } from "react-router-dom";

const { TabPane } = Tabs;

const ProfilePage = () => {
    const { username: routeUsername } = useParams(); // /profile/:username
    const [profile, setProfile] = useState(null);
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relationship, setRelationship] = useState(null); // ⬅ store friendship status
    const [form] = Form.useForm();
    const [tabKey, setTabKey] = useState("1");

    const fetchProfileAndGames = useCallback(async () => {
        setLoading(true);
        try {
            if (routeUsername) {
                // Other user
                const profileRes = await API.get(`/api/users/${routeUsername}`);
                setProfile(profileRes.data);

                const gamesRes = await API.get(`/api/users/${routeUsername}/games`);
                setGames(gamesRes.data);

                // Fetch friendship status
                const relationRes = await API.get(`/api/friends/status/${routeUsername}`);
                setRelationship(relationRes.data); // { status: "none" | "pending" | "friends", requestId? }
            } else {
                // Current user
                const profileRes = await API.get("/api/profile");
                setProfile(profileRes.data);

                const gamesRes = await API.get("/api/users/me/games");
                setGames(gamesRes.data);
            }
        } catch (err) {
            message.error("Failed to load profile or games");
        } finally {
            setLoading(false);
        }
    }, [routeUsername]);

    useEffect(() => {
        fetchProfileAndGames();
    }, [fetchProfileAndGames]);

    const handleEditProfile = async (values) => {
        try {
            const res = await API.put("/api/profile/edit", values);
            setProfile(res.data);
            message.success("Profile updated!");
            fetchProfileAndGames();
            setTabKey("1");
        } catch {
            message.error("Failed to update profile");
        }
    };

    // 🔹 Friendship actions
    const sendRequest = async () => {
        try {
            await API.post(`/api/friends/add/${routeUsername}`);
            message.success("Friend request sent!");
            fetchProfileAndGames();
        } catch (err) {
            message.error(err.response?.data?.error || "Failed to send request");
        }
    };

    const cancelRequest = async () => {
        try {
            await API.post(`/api/friends/reject/${relationship.requestId}`);
            message.success("Request cancelled");
            fetchProfileAndGames();
        } catch {
            message.error("Failed to cancel request");
        }
    };

    const unfriend = async () => {
        try {
            await API.post(`/api/friends/remove/${routeUsername}`);
            message.success("Friend removed");
            fetchProfileAndGames();
        } catch {
            message.error("Failed to unfriend");
        }
    };

    if (loading || !profile) {
        return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
    }

    return (
        <div>
            {/* Header Section */}
            <Card style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <Avatar size={80} icon={<UserOutlined />} />
                    <div>
                        <h2 style={{ margin: 0 }}>{profile.username}</h2>
                        <p style={{ margin: 0, color: "gray" }}>{profile.bio}</p>
                    </div>

                    <div style={{ marginLeft: "auto" }}>
                        {!routeUsername ? (
                            // ✅ Own profile
                            <Button
                                type="primary"
                                onClick={() => {
                                    form.setFieldsValue(profile);
                                    setTabKey("2");
                                }}
                            >
                                Edit Profile
                            </Button>
                        ) : (
                            // ✅ Other user's profile → friendship actions
                            <Space>
                                {relationship?.status === "none" && (
                                    <Button type="primary" onClick={sendRequest}>Add Friend</Button>
                                )}
                                {relationship?.status === "pending" && (
                                    <Button danger onClick={cancelRequest}>Cancel Request</Button>
                                )}
                                {relationship?.status === "friends" && (
                                    <Button danger onClick={unfriend}>Unfriend</Button>
                                )}
                            </Space>
                        )}
                    </div>
                </div>
            </Card>

            {/* Tabs Section */}
            <Card>
                <Tabs activeKey={tabKey} onChange={setTabKey}>
                    <TabPane tab="Library" key="1">
                        <List
                            itemLayout="horizontal"
                            dataSource={games}
                            renderItem={(game) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={
                                            <img
                                                src={
                                                    game.headerImageUrl
                                                        ? `http://localhost:5012${game.headerImageUrl}`
                                                        : "https://via.placeholder.com/60x80"
                                                }
                                                alt={game.name}
                                                style={{
                                                    width: 60,
                                                    height: 80,
                                                    objectFit: "cover",
                                                    borderRadius: 4
                                                }}
                                            />
                                        }
                                        title={game.name}
                                        description={`Playtime: ${game.playtime || "0h"}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>

                    {!routeUsername && (
                        <TabPane tab="Edit Profile" key="2">
                            <Form layout="vertical" form={form} initialValues={profile} onFinish={handleEditProfile}>
                                <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Bio" name="bio">
                                    <Input.TextArea rows={3} />
                                </Form.Item>
                                <Form.Item label="Email" name="email">
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Save Changes
                                    </Button>
                                </Form.Item>
                            </Form>
                        </TabPane>
                    )}
                </Tabs>
            </Card>
        </div>
    );
};

export default ProfilePage;
