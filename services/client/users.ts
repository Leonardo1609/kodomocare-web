import { AxiosResponse } from "axios";
import { EditParentData } from "../../interfaces/forms/edit-data";
import { ProfileData } from "../../interfaces/current-admin";
import { clientAxios } from "../../axios/clientAxios";
import { user } from "@prisma/client";

export const getUser = (uid: string): Promise<AxiosResponse<{ user: user }>> => {
    return clientAxios.get(`/user/profile/${uid}`)
}

export const updateProfile = (profileData: ProfileData): Promise<AxiosResponse<{ message: string }>> => {
    return clientAxios.put('/user/update-profile', { ...profileData })
}

export const updateParent = (uid: string, editParentData: Omit<EditParentData, "confirmPassword">): Promise<AxiosResponse<{ message: string }>> => {
    return clientAxios.put(`/user/update-parent/${uid}`, {
        ...editParentData,
    })
}

export const updateStatusParent = (parentId: string): Promise<AxiosResponse<{ message: string; status?: number }>> => {
    return clientAxios.put(
        `/user/update-parent/toggle-active/${parentId}`
    )
}