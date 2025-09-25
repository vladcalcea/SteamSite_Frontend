import React, { useEffect, useState } from "react";
import { List, Avatar, Button, Tabs, message, Spin, Input, Space, Card, Typography } from "antd";
import { UserOutlined, SendOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

const { TabPane } = Tabs;
const { Title } = Typography;

const FriendsPage = () => {
    const [friends, setFriends] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newFriend, setNewFriend] = useState("");
    const navigate = useNavigate();

    const fetchFriends = async () => {
        setLoading(true);
        try {
            const [friendsRes, pendingRes, sentRes] = await Promise.all([
                API.get("/api/friends"),
                API.get("/api/friends/pending"),
                API.get("/api/friends/sent"),
            ]);

            setFriends(friendsRes.data || []);

            // Map incoming requests
            setPendingRequests(
                pendingRes.data
                    .filter(req => req.id)
                    .map(req => ({
                        id: req.id,
                        username: req.from,
                        sentAt: req.sentAt
                    })) || []
            );

            // Map outgoing requests
            setSentRequests(
                sentRes.data
                    .filter(req => req.id)
                    .map(req => ({
                        id: req.id,
                        username: req.to,
                        sentAt: req.sentAt
                    })) || []
            );

        } catch (err) {
            message.error("Failed to load friends list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, []);

    const sendRequest = async () => {
        const usernameToSend = newFriend.trim();
        if (!usernameToSend) return message.warning("Enter a username");

        try {
            await API.post(`/api/friends/add/${usernameToSend}`);
            message.success(`Friend request sent to ${usernameToSend}!`);
            setNewFriend("");
            fetchFriends();
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to send request.";
            message.error(errorMessage);
        }
    };

    const acceptRequest = async (requestId) => {
        if (!requestId) {
            console.error("Attempted to accept request with undefined ID.");
            return message.error("Error: Cannot accept request. ID is missing.");
        }
        try {
            await API.post(`/api/friends/accept/${requestId}`);
            message.success("Friend request accepted!");
            fetchFriends();
        } catch {
            message.error("Failed to accept request");
        }
    };

    const declineRequest = async (requestId) => {
        if (!requestId) {
            console.error("Attempted to decline/cancel request with undefined ID.");
            return message.error("Error: Action failed. ID is missing.");
        }
        try {
            const res = await API.post(`/api/friends/reject/${requestId}`);
            message.success(res.data.message || "Request handled successfully!"); // Use backend message
            fetchFriends(); // ✅ FIX: Refresh data
        } catch {
            message.error("Failed to decline or cancel request");
        }
    };

    // ✅ FIX: Added the removeFriend function
    const removeFriend = async (username) => {
        if (!username) return message.error("Cannot remove friend without a username.");

        try {
            await API.post(`/api/friends/remove/${username}`);
            message.success(`Removed ${username} from your friends list.`);
            fetchFriends(); // Refresh the list after removing
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to remove friend.";
            message.error(errorMessage);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <Title level={2}>Friends</Title>

            <Card style={{ marginBottom: "2rem" }}>
                <Title level={4}>Add a Friend</Title>
                <Space.Compact style={{ width: "100%" }}>
                    <Input
                        placeholder="Enter username"
                        value={newFriend}
                        onChange={(e) => setNewFriend(e.target.value)}
                        onPressEnter={sendRequest}
                    />
                    <Button type="primary" icon={<SendOutlined />} onClick={sendRequest}>
                        Send Request
                    </Button>
                </Space.Compact>
            </Card>

            {loading ? (
                <Spin size="large" />
            ) : (
                <Tabs defaultActiveKey="1">
                    <TabPane tab={`Friends (${friends.length})`} key="1">
                        <List
                            itemLayout="horizontal"
                            dataSource={friends}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        // ✅ FIX: Wired up the removeFriend function
                                        <Button type="primary" danger onClick={() => removeFriend(item.username)}>
                                            Remove Friend
                                        </Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={<a onClick={() => navigate(`/profile/${item.username}`)}>{item.username}</a>}
                                        description={`Friends since: ${new Date(item.since).toLocaleDateString()}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab={`Pending Requests (${pendingRequests.length})`} key="2">
                        <List
                            itemLayout="horizontal"
                            dataSource={pendingRequests}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button type="primary" onClick={() => acceptRequest(item.id)}>Accept</Button>,
                                        <Button danger onClick={() => declineRequest(item.id)}>Decline</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={item.username}
                                        description={`Sent on: ${new Date(item.sentAt).toLocaleDateString()}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                    <TabPane tab={`Sent Requests (${sentRequests.length})`} key="3">
                        <List
                            itemLayout="horizontal"
                            dataSource={sentRequests}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button danger onClick={() => declineRequest(item.id)}>Cancel Request</Button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar icon={<UserOutlined />} />}
                                        title={item.username}
                                        description={`Sent on: ${new Date(item.sentAt).toLocaleDateString()}`}
                                    />
                                </List.Item>
                            )}
                        />
                    </TabPane>
                </Tabs>
            )}
        </div>
    );
};

export default FriendsPage;