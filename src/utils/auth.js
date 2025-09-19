// utils/auth.js
export const API_BASE_URL = 'https://localhost:44375';

// Token management functions
export const getToken = () => {
    return localStorage.getItem('token');
};

export const setToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
};

export const getUsername = () => {
    return localStorage.getItem('username');
};

export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    try {
        // Check if token is expired (basic check)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp < currentTime) {
            removeToken();
            return false;
        }

        return true;
    } catch (error) {
        removeToken();
        return false;
    }
};

// API call with authentication
export const apiCall = async (url, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${url}`, config);

        if (response.status === 401) {
            // Token expired or invalid
            removeToken();
            window.location.href = '/login';
            return;
        }

        return response;
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
};

// Login function
export const login = async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('username', username);
        return data;
    } else {
        throw new Error('Invalid credentials');
    }
};

// Logout function
export const logout = () => {
    removeToken();
    window.location.href = '/login';
};