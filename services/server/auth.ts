import { AxiosResponse } from "axios";
import { Buffer } from 'buffer'
import { komodoroAxiosServer } from "../../axios/komodoroAxios"

export const loginUser = (email: string, password: string): Promise<AxiosResponse<{ token: string, profileImage: string }>> => {
    const basicToken = Buffer.from(`${email}:${password}`).toString('base64');

    return komodoroAxiosServer.post('/login', {
        username: email,
        password: password
    }, {
        headers: {
            Authorization: `Basic ${basicToken}`,
        }
    })
}