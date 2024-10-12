import { createContext } from "react";
import useApi from "../hooks/useApi";
import PongResponse from "../../model/PongResponse";
import { pingPong } from "../../api/Pong";

export class PingPongContextType {
    public constructor(
        public refreshPing: () => void,
        public loading: boolean,
        public error: boolean,
        public pong?: PongResponse
    ) { }
}

export const PingPongContext = createContext<PingPongContextType | undefined>(undefined);

export const PingPongProvider = (props: { children: any }) => {

    const pingPongApi = useApi(pingPong, true);

    return <PingPongContext.Provider value={{ pong: pingPongApi.data, loading: pingPongApi.loading, refreshPing: pingPongApi.fetch, error: pingPongApi.error }}>
        {props.children}
    </PingPongContext.Provider>

}