import { useContext } from "react";
import { CurrencyContext, CurrencyContextType } from "../contexts/CurrencyContext";


export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) { throw new Error('AAAA!'); }
    return context as CurrencyContextType;
};