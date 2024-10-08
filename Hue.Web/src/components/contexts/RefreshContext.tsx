import { createContext, useState } from "react";

export class RefreshContextType {
    public constructor(
        public sendRefresh: (flag: string) => void,
        public subscribeFlag: (flag: string) => boolean
    ) { }
}

export const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export const RefreshProvider = (props: { children: any }) => {

    const [flags, setFlags] = useState({} as any)

    const subscribeFlag = (flag: string): boolean => flags[flag]

    const sendRefresh = (flag: string) => {
        setFlags({ ...flags, [flag]: !(subscribeFlag(flag) ?? false) })
    }

    return <RefreshContext.Provider value={{ subscribeFlag, sendRefresh }}>
        {props.children}
    </RefreshContext.Provider>

}