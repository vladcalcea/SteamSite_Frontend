import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Typography, Row, Col, Tag, Divider, Card, message } from "antd";
import API from "../../api/axios";

const { Title, Paragraph, Text } = Typography;

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    background: "rgba(0,0,0,0.6)",
};

const backgroundStyle = (url) => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: -2,
    backgroundImage: `url(${url})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    filter: "brightness(0.5) blur(0px)",
});

const contentStyle = {
    position: "relative",
    zIndex: 1,
    maxWidth: 900,
    margin: "40px auto",
    padding: 24,
    borderRadius: 8,
    background: "rgba(255,255,255,0.92)",
    color: "#222",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
};

const GamePage = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/api/games/${id}`)
            .then((res) => setGame(res.data))
            .catch(() => setGame(null))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddOrBuy = async () => {
        try {
            const res = await API.post("/api/profile/add", { gameId: game.gameId });
            if (res.status === 501) {
                message.info("Add to profile is not implemented yet.");
            } else if (res.status === 200 || res.status === 201) {
                message.success("Game added to your library!");
            } else {
                message.error("Unexpected response from server.");
            }
        } catch (err) {
            message.error("Failed to add game to profile");
        }
    };

    if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
    if (!game) return <Title level={3} style={{ color: '#222' }}>Game not found</Title>;

    // Instead of overlay/background covering the whole viewport, only cover the main content area
    // Remove fixed positioning and use relative/absolute within the content wrapper

    const bgUrl = game.backgroundImage ? `http://localhost:5012${game.backgroundImage}` : null;

    return (
        <div style={{ minHeight: "100vh", position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ position: "relative", width: "100%", maxWidth: 900, margin: "40px 0" }}>
                    {bgUrl && (
                        <div style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 0,
                            backgroundImage: `url(${bgUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            filter: "brightness(0.5) blur(0px)"
                        }} />
                    )}
                    <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1,
                        background: "rgba(0,0,0,0.6)"
                    }} />
                    <div style={{ ...contentStyle, position: "relative", zIndex: 2, background: "rgba(255,255,255,0.92)" }}>
                        {game.headerImageUrl && (
                            <img
                                src={`http://localhost:5012${game.headerImageUrl}`}
                                alt={game.name}
                                style={{ width: "100%", maxHeight: 350, objectFit: "cover", borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.12)" }}
                            />
                        )}
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={16}>
                                <Title level={2} style={{ color: "#222" }}>{game.name}</Title>
                                <Paragraph type="secondary" style={{ color: "#444" }}>{game.shortDescription}</Paragraph>
                                <Divider />
                                <Paragraph style={{ color: "#222" }}>{game.detailedDescription}</Paragraph>
                                <Divider />
                                <Text strong style={{ color: "#222" }}>Developer:</Text> {game.developer || "-"} <br />
                                <Text strong style={{ color: "#222" }}>Publisher:</Text> {game.publisher || "-"} <br />
                                <Text strong style={{ color: "#222" }}>Release Date:</Text> {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "-"} <br />
                                <Text strong style={{ color: "#222" }}>Price:</Text> {game.price ? `$${game.price}` : "Free"} <br />
                                <Divider />
                                {game.categories && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Text strong style={{ color: "#222" }}>Categories: </Text>
                                        {game.categories.split(",").map((cat) => (
                                            <Tag key={cat.trim()} color="geekblue">{cat.trim()}</Tag>
                                        ))}
                                    </div>
                                )}
                                {game.tags && (
                                    <div>
                                        <Text strong style={{ color: "#222" }}>Tags: </Text>
                                        {game.tags.split(",").map((tag) => (
                                            <Tag color="blue" key={tag.trim()}>{tag.trim()}</Tag>
                                        ))}
                                    </div>
                                )}
                                <Divider />
                                <div style={{ marginTop: 24 }}>
                                    <button
                                        onClick={handleAddOrBuy}
                                        style={{
                                            background: game.price && game.price > 0 ? "#1890ff" : "#52c41a",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 6,
                                            padding: "12px 32px",
                                            fontSize: 18,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                            transition: "background 0.2s"
                                        }}
                                    >
                                        {game.price && game.price > 0 ? "Buy Game" : "Add Game"}
                                    </button>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                                {/* Optionally show background image as a card preview, but not needed since it's the page bg */}
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;
