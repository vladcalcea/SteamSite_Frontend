import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5012",
    withCredentials: true, // send cookies
});

export default API;
