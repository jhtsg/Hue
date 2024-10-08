import PongResponse from "../model/PongResponse";
import { API_PREFIX, Get } from "./Common";

const ENDPOINT = API_PREFIX + "ping/"

export const pingPong = (
    setLoading: (value: boolean) => void,
    setItem: (val: PongResponse) => void,
    onError: (value: any) => void,
) => {

    const pingTime = new Date(Date.now()).toISOString();

    const internalSetItem = (val: PongResponse | undefined) => {
        if (!val) return;
        val.pingTime = pingTime;
        setItem(val);

    }

    Get(setLoading, internalSetItem, onError, ENDPOINT)

}

