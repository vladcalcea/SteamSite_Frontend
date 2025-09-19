import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Typography, message } from "antd";
import API from "../../api/axios";

const { Title, Paragraph } = Typography;

const GamePage = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.get(`/api/games/${id}`)
            .then((res) => setGame(res.data))
            .catch(() => message.error("Failed to load game"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
    if (!game) return <Title level={3}>Game not found</Title>;

    return (
        <div>
            <img
                src={`${process.env.REACT_APP_API_URL}${game.cover}`}
                alt={game.title}
                style={{ width: "100%", maxHeight: "400px", objectFit: "cover", borderRadius: "8px" }}
            />
            <Title level={2}>{game.title}</Title>
            <Paragraph>{game.description}</Paragraph>
            <Paragraph strong>Price: {game.price}</Paragraph>
        </div>
    );
};

export default GamePage;
