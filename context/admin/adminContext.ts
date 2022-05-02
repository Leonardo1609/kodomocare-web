import { createContext } from "react";
import { ICurrentAdmin } from "../../interfaces/current-admin";

interface IUserContext {
    admin: ICurrentAdmin,
    setCurrentAdmin: React.Dispatch<React.SetStateAction<ICurrentAdmin>>
}

export const AdminContext = createContext<IUserContext>({
    admin: {
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        dni: '',
    },
    setCurrentAdmin: () => { }
})

