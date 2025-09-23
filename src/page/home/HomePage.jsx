import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, Typography, Carousel } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Meta } = Card;

const API_URL = "http://localhost:5012";

const HomePage = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/api/games`)
            .then((res) => setGames(res.data))
            .catch(() => console.error("Failed to load games"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: "center", marginTop: 50 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ padding: "24px" }}>
            {/* Slideshow Section */}
            {games.length > 0 && (
                <>
                    <Title level={2} style={{ marginBottom: 16 }}>Featured Games</Title>
                    <Carousel autoplay dots arrows infinite>
                        {games.map((game) => (
                            <div key={game.gameId} style={{ position: "relative", cursor: "pointer" }}
                                 onClick={() => navigate(`/game/${game.gameId}`)}>
                                <img
                                    src={game.backgroundImage || game.headerImageUrl
                                        ? `${API_URL}${game.backgroundImage || game.headerImageUrl}`
                                        : "https://via.placeholder.com/1200x400"}
                                    alt={game.name}
                                    style={{
                                        width: "100%",
                                        height: "400px",
                                        objectFit: "cover",
                                        borderRadius: 12,
                                    }}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: 20,
                                        left: 20,
                                        background: "rgba(0,0,0,0.6)",
                                        color: "#fff",
                                        padding: "12px 20px",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Title level={3} style={{ color: "#fff", margin: 0 }}>
                                        {game.name}
                                    </Title>
                                    <Text>{game.shortDescription || "No description"}</Text>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </>
            )}

            {/* Grid Section */}
            <Title level={2} style={{ margin: "32px 0 24px" }}>All Games</Title>
            <Row gutter={[16, 16]}>
                {games.map((game) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={game.gameId}>
                        <Card
                            hoverable
                            onClick={() => navigate(`/game/${game.gameId}`)}
                            cover={
                                <img
                                    src={game.headerImageUrl
                                        ? `${API_URL}${game.headerImageUrl}`
                                        : "https://via.placeholder.com/400x200"}
                                    alt={game.name}
                                    style={{
                                        height: "200px",
                                        objectFit: "cover",
                                        borderTopLeftRadius: 8,
                                        borderTopRightRadius: 8,
                                    }}
                                />
                            }
                            style={{ borderRadius: 12 }}
                        >
                            <Meta
                                title={game.name}
                                description={
                                    <>
                                        <Text type="secondary">{game.shortDescription || "No description"}</Text>
                                        <br />
                                        <Text strong>
                                            {game.price === 0 ? "Free to Play" : `$${game.price}`}
                                        </Text>
                                    </>
                                }
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default HomePage;
