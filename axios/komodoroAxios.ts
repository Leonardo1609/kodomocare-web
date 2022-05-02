import axios from "axios";

export const komodoroAxiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_KOMODORO_BACKEND
})

export const komodoroAxiosServer = axios.create({
    baseURL: process.env.KOMODORO_BACKEND
})