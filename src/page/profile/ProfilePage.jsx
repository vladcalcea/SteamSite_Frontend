import React, { useState } from "react";
import { Avatar, Button, Card, Tabs, List, Form, Input, message } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        username: "PlayerOne",
        bio: "No bio",
        email: "playerone@example.com",
    });

    // Example games data
    const games = [
        { id: 1, title: "Counter-Strike 2", playtime: "120h", cover: "/images/cs.jpg" },
        { id: 2, title: "Dota 2", playtime: "250h", cover: "/images/dota2.jpg" },
        { id: 3, title: "Cyberpunk 2077", playtime: "40h", cover: "/images/cyberpunk.png" },
    ];

    // Example friends data
    const friends = [
        { id: 1, name: "GamerBro", status: "Online" },
        { id: 2, name: "NoScopeKing", status: "Offline" },
        { id: 3, name: "PixelQueen", status: "Online" },
    ];

    const [form] = Form.useForm();

    const handleEditProfile = (values) => {
        setProfile(values);
        message.success("Profile updated!");
    };

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
                                        avatar={<img src={game.cover} alt={game.title} style={{ width: 60, height: 80, objectFit: "cover", borderRadius: 4 }} />}
                                        title={game.title}
                                        description={`Playtime: ${game.playtime}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>

                    {/* Friends Tab */}
                    <TabPane tab="Friends" key="2">
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
                    </TabPane>

                    {/* Edit Profile Tab */}
                    <TabPane tab="Edit Profile" key="3">
                        <Form
                            layout="vertical"
                            form={form}
                            initialValues={profile}
                            onFinish={handleEditProfile}
                        >
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
