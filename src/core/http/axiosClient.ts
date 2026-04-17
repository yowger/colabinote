import axios from "axios"

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const API_URL = SERVER_URL + "/api"

export const http = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})
