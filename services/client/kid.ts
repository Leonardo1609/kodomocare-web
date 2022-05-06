import { AxiosResponse } from "axios"
import { EditKidData } from "../../interfaces/forms/edit-data"
import { IKidsQuestionnaries } from "../../interfaces/questionnaires"
import { clientAxios } from "../../axios/clientAxios"
import { komodoroAxiosClient } from "../../axios/komodoroAxios"

export const updateKid = (kidId: string, editKidData: EditKidData): Promise<AxiosResponse<{ message: string }>> => {
    return clientAxios.put(`/kid/update-kid/${kidId}`, {
        ...editKidData,
    })
}

export const getKidsByParent = (parentId: string): Promise<AxiosResponse<IKidsQuestionnaries[]>> => {
    return komodoroAxiosClient
        .get(
            `/admin/questionnaires-completed/${parentId}`,
            {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            }
        )
}