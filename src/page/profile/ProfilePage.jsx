import React, { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Card, Tabs, List, Form, Input, message, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";
import API from "../../api/axios";
import { useLocation } from "react-router-dom";

const { TabPane } = Tabs;

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [games, setGames] = useState([]);
    const [friends, setFriends] = useState([]); // Placeholder for future
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const location = useLocation();

    // Fetch profile and games
    const fetchProfileAndGames = useCallback(async () => {
        setLoading(true);
        try {
            const profileRes = await API.get("/api/profile");
            setProfile(profileRes.data);
            const gamesRes = await API.get("/api/users/me/games");
            setGames(gamesRes.data);
        } catch (err) {
            message.error("Failed to load profile or games");
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch friends (stub)
    const fetchFriends = useCallback(async () => {
        try {
            const res = await API.get("/api/profile/friends");
            if (res.status === 501) {
                setFriends([]);
            } else {
                setFriends(res.data);
            }
        } catch {
            setFriends([]);
        }
    }, []);

    // Listen for add-to-profile event
    useEffect(() => {
        const handleAddToProfile = async (e) => {
            const game = e.detail.game;
            try {
                const res = await API.post("/api/profile/add", { gameId: game.gameId });
                if (res.status === 501) {
                    message.info("Add to profile is not implemented yet.");
                } else {
                    message.success("Game added to your library!");
                    fetchProfileAndGames();
                }
            } catch (err) {
                message.error("Failed to add game to profile");
            }
        };
        window.addEventListener("add-to-profile", handleAddToProfile);
        return () => window.removeEventListener("add-to-profile", handleAddToProfile);
    }, [fetchProfileAndGames]);

    useEffect(() => {
        fetchProfileAndGames();
        fetchFriends();
    }, [fetchProfileAndGames, fetchFriends]);

    // Refresh library when navigating to profile page
    useEffect(() => {
        fetchProfileAndGames();
    }, [location.pathname, fetchProfileAndGames]);

    // Edit profile handler (stub)
    const handleEditProfile = async (values) => {
        try {
            const res = await API.put("/api/profile/edit", values);
            if (res.status === 501) {
                message.info("Edit profile is not implemented yet.");
            } else {
                setProfile(res.data);
                message.success("Profile updated!");
                fetchProfileAndGames();
            }
        } catch {
            message.error("Failed to update profile");
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
                        <Button type="primary" onClick={() => form.setFieldsValue(profile)}>
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Tabs Section */}
            <Card>
                <Tabs defaultActiveKey="1">
                    {/* Library Tab */}
                    <TabPane tab="Library" key="1">
                        <List
                            itemLayout="horizontal"
                            dataSource={games}
                            renderItem={(game) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<img src={game.headerImageUrl ? `http://localhost:5012${game.headerImageUrl}` : "https://via.placeholder.com/60x80"} alt={game.name} style={{ width: 60, height: 80, objectFit: "cover", borderRadius: 4 }} />}
                                        title={game.name}
                                        description={`Playtime: ${game.playtime || "0h"}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>

                    {/* Friends Tab */}
                    <TabPane tab="Friends" key="2">
                        {friends.length === 0 ? (
                            <div style={{ color: "gray" }}>Friends feature is not implemented yet.</div>
                        ) : (
                            <List
                                itemLayout="horizontal"
                                dataSource={friends}
                                renderItem={(friend) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<Avatar icon={<UserOutlined />} />}
                                            title={friend.name}
                                            description={friend.status}
                                        />
                                    </List.Item>
                                )}
                            />
                        )}
                    </TabPane>

                    {/* Edit Profile Tab */}
                    <TabPane tab="Edit Profile" key="3">
                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={profile}
                            onFinish={handleEditProfile}
                        >
                            <Form.Item label="Username" name="username" rules={[{ required: true }]}> <Input /> </Form.Item>
                            <Form.Item label="Bio" name="bio"> <Input.TextArea rows={3} /> </Form.Item>
                            <Form.Item label="Email" name="email"> <Input /> </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Save Changes</Button>
                            </Form.Item>
                        </Form>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
};

export default ProfilePage;
