import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spin, Typography, Row, Col, Tag, Divider, Button, Card, message, Carousel } from "antd";
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
    BUTTON_GAME_OWNED,
    LABEL_DEVELOPER,
    LABEL_PUBLISHER,
    LABEL_RELEASE_DATE,
    LABEL_PRICE,
    LABEL_CATEGORIES,
    LABEL_TAGS,
    FALLBACK_VALUE,
    FALLBACK_PRICE,
    CATEGORY_TAG_COLOR,
    TAG_COLOR,
} from "./constant.js";
import "./style.scss";

const { Title, Paragraph, Text } = Typography;

const GamePage = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwned, setIsOwned] = useState(false);
    const [isCheckingOwned, setIsCheckingOwned] = useState(true);

    const checkGameOwnership = async (gameId) => {
        setIsCheckingOwned(true);
        try {
            const res = await API.get("/api/users/me/games");
            const ownedGames = res.data;
            const owned = ownedGames.some(g => g.gameId === gameId);
            setIsOwned(owned);
        } catch (error) {
            setIsOwned(false);
        } finally {
            setIsCheckingOwned(false);
        }
    };

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await API.get(`/api/games/${id}`);
                setGame(res.data);
                checkGameOwnership(parseInt(id, 10)); // Ensure ID is a number for comparison
            } catch (error) {
                setGame(null);
                setIsCheckingOwned(false);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    const handleAddOrBuy = async () => {
        if (!game || isOwned) return;

        try {
            const res = await API.post("/api/profile/add", { gameId: game.gameId });

            if (res.status === 501) {
                message.info(MESSAGE_ADD_NOT_IMPLEMENTED);
            } else if (res.status === 200 || res.status === 201) {
                message.success(MESSAGE_GAME_ADDED_SUCCESS);
                setIsOwned(true);
            } else {
                message.error(MESSAGE_UNEXPECTED_RESPONSE);
            }
        } catch (err) {
            message.error(err.response?.data?.error || MESSAGE_GAME_ADD_ERROR);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        if (url.includes('/embed/')) return url;

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);

        if (match && match[2] && match[2].length === 11) {
            return `https://www.youtube.com/embed/${match[2]}`;
        }
        return url;
    };

    // This function is safe here because it's only CALLED after 'game' is confirmed to exist.
    const createCarouselItems = () => {
        const items = [];
        const images = Array.isArray(game.gameImages) ? game.gameImages : [];

        images.forEach((imageUrl, index) => {
            items.push(
                <div key={`image-${index}`} className="game-page__carousel-slide">
                    <img
                        src={`${API_BASE_URL}${imageUrl}`}
                        alt={`${game.name} screenshot ${index + 1}`}
                        className="game-page__carousel-image"
                    />
                </div>
            );
        });

        if (game.trailerUrl) {
            const embedUrl = getYouTubeEmbedUrl(game.trailerUrl);
            items.push(
                <div key="trailer" className="game-page__carousel-slide">
                    <iframe
                        className="game-page__carousel-video"
                        src={embedUrl}
                        title={`${game.name} Trailer`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            );
        }
        return items;
    };

    if (loading) {
        return <Spin size="large" className="loading-spinner" />;
    }

    if (!game) {
        return <Title level={3} className="not-found-title">{TITLE_GAME_NOT_FOUND}</Title>;
    }

    const isPriced = game.price && game.price > 0;
    let buttonText = isPriced ? BUTTON_BUY_GAME : BUTTON_ADD_GAME;
    let buttonType = isPriced ? "primary" : "ghost";
    let isButtonDisabled = false;

    if (isOwned) {
        buttonText = BUTTON_GAME_OWNED;
        buttonType = "default";
        isButtonDisabled = true;
    } else if (isCheckingOwned) {
        buttonText = "Checking...";
        isButtonDisabled = true;
    }

    const bgUrl = game.backgroundImage ? `${API_BASE_URL}${game.backgroundImage}` : null;

    // ✅ FIX: The function is now called safely after all checks have passed.
    const carouselItems = createCarouselItems();

    return (
        <div className="game-page">
            <div className="game-page__container">
                <div className="game-page__wrapper">
                    {bgUrl && (
                        <div
                            className="game-page__background"
                        />
                    )}
                    <div className="game-page__overlay" />
                    <div className="game-page__content">
                        <Title level={2} className="game-page__title">
                            {game.name}
                        </Title>
                        <Paragraph className="game-page__description-short">
                            {game.shortDescription}
                        </Paragraph>

                        {carouselItems.length > 0 && (
                            <div className="game-page__carousel-wrapper">
                                <Carousel
                                    autoplay
                                    dots={true}
                                    arrows={true}
                                    infinite={true}
                                    className="game-page__carousel"
                                >
                                    {carouselItems}
                                </Carousel>
                            </div>
                        )}

                        <Divider className="game-page__divider" />
                        <Row gutter={[24, 24]}>
                            <Col xs={24} md={16}>
                                {game.detailedDescription && (
                                    <>
                                        <Title level={4}>About This Game</Title>
                                        <Paragraph className="game-page__description--detailed" style={{whiteSpace: 'pre-line'}}>
                                            {game.detailedDescription}
                                        </Paragraph>
                                    </>
                                )}
                                <Divider className="game-page__divider" />
                                {(game.categories || game.tags) && (
                                    <Row gutter={[8, 8]}>
                                        {game.categories && (
                                            <Col>
                                                <Text className="game-page__tags-label">{LABEL_CATEGORIES}</Text>
                                                {game.categories.split(",").map((cat) => (
                                                    <Tag key={cat.trim()} color={CATEGORY_TAG_COLOR} className="game-page__tag">
                                                        {cat.trim()}
                                                    </Tag>
                                                ))}
                                            </Col>
                                        )}
                                        {game.tags && (
                                            <Col>
                                                <Text className="game-page__tags-label">{LABEL_TAGS}</Text>
                                                {game.tags.split(",").map((tag) => (
                                                    <Tag color={TAG_COLOR} key={tag.trim()} className="game-page__tag">
                                                        {tag.trim()}
                                                    </Tag>
                                                ))}
                                            </Col>
                                        )}
                                    </Row>
                                )}
                            </Col>
                            <Col xs={24} md={8}>
                                <Card className="game-page__sidebar-card" bordered={false}>
                                    <div className="game-page__price-block">
                                        <Text strong className="game-page__price-label">{LABEL_PRICE}</Text>
                                        <Text className="game-page__price-value">
                                            {game.price ? `$${game.price}` : FALLBACK_PRICE}
                                        </Text>
                                    </div>
                                    <Button
                                        onClick={handleAddOrBuy}
                                        type={buttonType}
                                        className={`game-page__buy-button ${isPriced ? 'game-page__buy-button--buy' : 'game-page__buy-button--add'} ${isOwned ? 'game-page__buy-button--owned' : ''}`}
                                        block
                                        size="large"
                                        disabled={isButtonDisabled}
                                    >
                                        {buttonText}
                                        {isCheckingOwned && !isOwned && <Spin size="small" style={{ marginLeft: 8 }} />}
                                    </Button>
                                    <Divider className="game-page__divider--small" />
                                    <div className="game-page__info-block">
                                        <div className="game-page__info">
                                            <Text className="game-page__info-label">{LABEL_DEVELOPER}</Text>
                                            <span className="game-page__info-value">
                                                {game.developer || FALLBACK_VALUE}
                                            </span>
                                        </div>
                                        <div className="game-page__info">
                                            <Text className="game-page__info-label">{LABEL_PUBLISHER}</Text>
                                            <span className="game-page__info-value">
                                                {game.publisher || FALLBACK_VALUE}
                                            </span>
                                        </div>
                                        <div className="game-page__info">
                                            <Text className="game-page__info-label">{LABEL_RELEASE_DATE}</Text>
                                            <span className="game-page__info-value">
                                                {game.releaseDate
                                                    ? new Date(game.releaseDate).toLocaleDateString()
                                                    : FALLBACK_VALUE
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamePage;