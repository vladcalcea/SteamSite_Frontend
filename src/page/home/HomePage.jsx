import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col, Spin, Typography } from "antd";
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
            <Title level={2} style={{ marginBottom: 24 }}>Available Games</Title>

            <Row gutter={[16, 16]}>
                {games.map((game) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={game.gameId}>
                        <Card
                            hoverable
                            onClick={() => navigate(`/game/${game.gameId}`)}
                            cover={
                                <img
                                    src={game.headerImageUrl ? `${API_URL}${game.headerImageUrl}` : "https://via.placeholder.com/400x200"}
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
