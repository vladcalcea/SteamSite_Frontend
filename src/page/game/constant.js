// GamePage Constants
export const API_BASE_URL = "http://localhost:5012";

// Messages
export const TITLE_GAME_NOT_FOUND = 'Game not found';
export const MESSAGE_GAME_ADDED_SUCCESS = "Game added to your library!";
export const MESSAGE_GAME_ADD_ERROR = "Failed to add game to profile";
export const MESSAGE_ADD_NOT_IMPLEMENTED = "Add to profile is not implemented yet.";
export const MESSAGE_UNEXPECTED_RESPONSE = "Unexpected response from server.";

// Button Labels
export const BUTTON_BUY_GAME = "Buy Game";
export const BUTTON_ADD_GAME = "Add Game";
export const BUTTON_GAME_OWNED = "Game Owned"; // 🔑 FIX: New constant

// Field Labels
export const LABEL_DEVELOPER = "Developer:";
export const LABEL_PUBLISHER = "Publisher:";
export const LABEL_RELEASE_DATE = "Release Date:";
export const LABEL_PRICE = "Price:";
export const LABEL_CATEGORIES = "Categories: ";
export const LABEL_TAGS = "Tags: ";
export const LABEL_TRAILER = "Trailer";

// Fallback Values
export const FALLBACK_VALUE = "-";
export const FALLBACK_PRICE = "Free";

// Tag Colors
export const CATEGORY_TAG_COLOR = "geekblue";
export const TAG_COLOR = "blue";

// Styles
export const contentStyle = {
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

export const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 0,
    background: "rgba(0,0,0,0.6)",
};

export const backgroundStyle = (url) => ({
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

export const gameImageStyle = {
    width: "100%",
    maxHeight: 350,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: "0 2px 16px rgba(0,0,0,0.12)"
};

export const buyButtonStyle = {
    background: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 32px",
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    transition: "background 0.2s"
};

export const addButtonStyle = {
    background: "#52c41a",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "12px 32px",
    fontSize: 18,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    transition: "background 0.2s"
};