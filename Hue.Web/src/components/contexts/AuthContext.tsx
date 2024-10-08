import { createContext } from "react";
import User from "../../model/User";
import useApi from "../hooks/useApi";
import { getUser } from "../../api/Auth";

export class UserContextType {
    public constructor(
        public refreshAuth: () => void,
        public loading: boolean,
        public user?: User
    ) { }
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const AuthProvider = (props: { children: any }) => {

    const authApi = useApi(getUser, true);

    return <UserContext.Provider value={{ user: authApi.data, loading: authApi.loading, refreshAuth: authApi.fetch }}>
        {props.children}
    </UserContext.Provider>

}