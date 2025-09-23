import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Typography, Row, Col, Tag, Divider, message } from "antd";
import API from "../../api/axios";
import {
    API_BASE_URL,
    TITLE_GAME_NOT_FOUND,
    MESSAGE_GAME_ADDED_SUCCESS,
    MESSAGE_GAME_ADD_ERROR,
    MESSAGE_ADD_NOT_IMPLEMENTED,
    MESSAGE_UNEXPECTED_RESPONSE,
    BUTTON_BUY_GAME,
    BUTTON_ADD_GAME,
    LABEL_DEVELOPER,
    LABEL_PUBLISHER,
    LABEL_RELEASE_DATE,
    LABEL_PRICE,
    LABEL_CATEGORIES,
    LABEL_TAGS,
    LABEL_TRAILER,
    FALLBACK_VALUE,
    FALLBACK_PRICE,
    CATEGORY_TAG_COLOR,
    TAG_COLOR,
    contentStyle,
    gameImageStyle,
    buyButtonStyle,
    addButtonStyle
} from "./constant.js";
import "./style.scss";

const { Title, Paragraph, Text } = Typography;

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
                message.info(MESSAGE_ADD_NOT_IMPLEMENTED);
            } else if (res.status === 200 || res.status === 201) {
                message.success(MESSAGE_GAME_ADDED_SUCCESS);
            } else {
                message.error(MESSAGE_UNEXPECTED_RESPONSE);
            }
        } catch (err) {
            message.error(MESSAGE_GAME_ADD_ERROR);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;

        // Check if it's already an embed URL
        if (url.includes('/embed/')) return url;

        // Extract video ID from various YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }

        // If not a YouTube URL, return as is (for other video URLs)
        return url;
    };

    if (loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    if (!game) {
        return <Title level={3} className="not-found-title">{TITLE_GAME_NOT_FOUND}</Title>;
    }

    const bgUrl = game.backgroundImage ? `${API_BASE_URL}${game.backgroundImage}` : null;
    const headerImageUrl = game.headerImageUrl ? `${API_BASE_URL}${game.headerImageUrl}` : null;

    return (
        <div className="game-page">
            <div className="game-page__container">
                <div className="game-page__wrapper">
                    {bgUrl && (
                        <div
                            className="game-page__background"
                            style={{ backgroundImage: `url(${bgUrl})` }}
                        />
                    )}
                    <div className="game-page__overlay" />
                    <div className="game-page__content" style={contentStyle}>
                        {game.trailerUrl && (
                            <div style={{ marginBottom: 24 }}>
                                <Title level={4} className="game-page__title">
                                    {LABEL_TRAILER}
                                </Title>
                                <iframe
                                    className="game-page__trailer"
                                    src={getYouTubeEmbedUrl(game.trailerUrl)}
                                    title="Game Trailer"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}

                        {headerImageUrl && (
                            <img
                                src={headerImageUrl}
                                alt={game.name}
                                className="game-page__header-image"
                                style={gameImageStyle}
                            />
                        )}
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={16}>
                                <Title level={2} className="game-page__title">
                                    {game.name}
                                </Title>

                                <Paragraph className="game-page__description">
                                    {game.shortDescription}
                                </Paragraph>

                                <Divider />

                                <Paragraph className="game-page__description--detailed">
                                    {game.detailedDescription}
                                </Paragraph>

                                <Divider />

                                <div className="game-page__info">
                                    <Text className="game-page__info-label">{LABEL_DEVELOPER}</Text>{" "}
                                    <span className="game-page__info-value">
                                        {game.developer || FALLBACK_VALUE}
                                    </span>
                                </div>

                                <div className="game-page__info">
                                    <Text className="game-page__info-label">{LABEL_PUBLISHER}</Text>{" "}
                                    <span className="game-page__info-value">
                                        {game.publisher || FALLBACK_VALUE}
                                    </span>
                                </div>

                                <div className="game-page__info">
                                    <Text className="game-page__info-label">{LABEL_RELEASE_DATE}</Text>{" "}
                                    <span className="game-page__info-value">
                                        {game.releaseDate
                                            ? new Date(game.releaseDate).toLocaleDateString()
                                            : FALLBACK_VALUE
                                        }
                                    </span>
                                </div>

                                <div className="game-page__info">
                                    <Text className="game-page__info-label">{LABEL_PRICE}</Text>{" "}
                                    <span className="game-page__info-value">
                                        {game.price ? `$${game.price}` : FALLBACK_PRICE}
                                    </span>
                                </div>

                                <Divider />

                                {game.categories && (
                                    <div className="game-page__tags">
                                        <Text className="game-page__tags-label">{LABEL_CATEGORIES}</Text>
                                        {game.categories.split(",").map((cat) => (
                                            <Tag key={cat.trim()} color={CATEGORY_TAG_COLOR}>
                                                {cat.trim()}
                                            </Tag>
                                        ))}
                                    </div>
                                )}

                                {game.tags && (
                                    <div className="game-page__tags">
                                        <Text className="game-page__tags-label">{LABEL_TAGS}</Text>
                                        {game.tags.split(",").map((tag) => (
                                            <Tag color={TAG_COLOR} key={tag.trim()}>
                                                {tag.trim()}
                                            </Tag>
                                        ))}
                                    </div>
                                )}

                                <Divider />

                                <div>
                                    <button
                                        onClick={handleAddOrBuy}
                                        className={`game-page__button ${
                                            game.price && game.price > 0
                                                ? 'game-page__button--buy'
                                                : 'game-page__button--add'
                                        }`}
                                        style={game.price && game.price > 0 ? buyButtonStyle : addButtonStyle}
                                    >
                                        {game.price && game.price > 0 ? BUTTON_BUY_GAME : BUTTON_ADD_GAME}
                                    </button>
                                </div>
                            </Col>
                            <Col xs={24} md={8}>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;