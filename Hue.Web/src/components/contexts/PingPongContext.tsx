import { createContext } from "react";
import useApi from "../hooks/useApi";
import PongResponse from "../../model/PongResponse";
import { pingPong } from "../../api/Pong";

export class PingPongContextType {
    public constructor(
        public refreshPing: () => void,
        public loading: boolean,
        public pong?: PongResponse
    ) { }
}

export const PingPongContext = createContext<PingPongContextType | undefined>(undefined);

export const PingPongProvider = (props: { children: any }) => {

    const authApi = useApi(pingPong, true);

    return <PingPongContext.Provider value={{ pong: authApi.data, loading: authApi.loading, refreshPing: authApi.fetch }}>
        {props.children}
    </PingPongContext.Provider>

}