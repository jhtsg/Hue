import { ExternalGet } from "./Common";

export const getCurrencies = (
    setLoading: (value: boolean) => void,
    setItem: (value?: any) => void,
    onError: (value: any) => void,
    currency?: string
) => ExternalGet(setLoading, setItem, onError, `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency?.toLowerCase() ?? 'usd'}.json`)