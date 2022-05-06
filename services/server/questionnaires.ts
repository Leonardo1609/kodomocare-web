import { AxiosResponse } from "axios";
import { komodoroAxiosServer } from "../../axios/komodoroAxios";

export const getQuestionnariesWithMonth = (token: string): Promise<AxiosResponse<{ id: string; kidId: string; status: number; updatedDate: string }[]>> => {
    return komodoroAxiosServer.get('/admin/questionnaires', {
        headers: {
            authorization: `Bearer ${token}`,
        },
    })
}

export const getKidsAgesInEvaluations = (token: string): Promise<AxiosResponse<{ id: string, month_test: number }[]>> => {
    return komodoroAxiosServer.get(
        '/admin/evaluations-month/',
        {
            headers: {
                authorization: `Bearer ${token}`,
            },
        }
    )

}