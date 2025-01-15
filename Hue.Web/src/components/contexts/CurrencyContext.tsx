import { createContext } from "react";
import useApi from "../hooks/useApi";
import { getCurrencies } from "../../api/External";

// export type availableCurrencies = "1inch" | "aave" | "ada" | "aed" | "afn" | "agix" | "akt" | "algo" | "all" | "amd" | "amp" | "ang" | 
//     "aoa" | "ape" | "apt" | "ar" | "arb" | "ars" | "atom" | "ats" | "aud" | "avax" | "awg" | "axs" | "azm" | "azn" | "bake" | "bam" | 
//     "bat" | "bbd" | "bch" | "bdt" | "bef" | "bgn" | "bhd" | "bif" | "bmd" | "bnb" | "bnd" | "bob" | "brl" | "bsd" | "bsv" | "bsw" | 
//     "btc" | "btcb" | "btg" | "btn" | "btt" | "busd" | "bwp" | "byn" | "byr" | "bzd" | "cad" | "cake" | "cdf" | "celo" | "cfx" | "chf" | 
//     "chz" | "clp" | "cnh" | "cny" | "comp" | "cop" | "crc" | "cro" | "crv" | "cspr" | "cuc" | "cup" | "cve" | "cvx" | "cyp" | "czk" | 
//     "dai" | "dash" | "dcr" | "dem" | "dfi" | "djf" | "dkk" | "doge" | "dop" | "dot" | "dydx" | "dzd" | "eek" | "egld" | "egp" | "enj" | 
//     "eos" | "ern" | "esp" | "etb" | "etc" | "eth" | "eur" | "fei" | "fil" | "fim" | "fjd" | "fkp" | "flow" | "flr" | "frax" | "frf" | 
//     "ftt" | "fxs" | "gala" | "gbp" | "gel" | "ggp" | "ghc" | "ghs" | "gip" | "gmd" | "gmx" | "gnf" | "gno" | "grd" | "grt" | "gt" | 
//     "gtq" | "gusd" | "gyd" | "hbar" | "hkd" | "hnl" | "hnt" | "hot" | "hrk" | "ht" | "htg" | "huf" | "icp" | "idr" | "iep" | "ils" | 
//     "imp" | "imx" | "inj" | "inr" | "iqd" | "irr" | "isk" | "itl" | "jep" | "jmd" | "jod" | "jpy" | "kas" | "kava" | "kcs" | "kda" | 
//     "kes" | "kgs" | "khr" | "klay" | "kmf" | "knc" | "kpw" | "krw" | "ksm" | "kwd" | "kyd" | "kzt" | "lak" | "lbp" | "ldo" | "leo" | 
//     "link" | "lkr" | "lrc" | "lrd" | "lsl" | "ltc" | "ltl" | "luf" | "luna" | "lunc" | "lvl" | "lyd" | "mad" | "mana" | "matic" | 
//     "mbx" | "mdl" | "mga" | "mgf" | "mina" | "mkd" | "mkr" | "mmk" | "mnt" | "mop" | "mro" | "mru" | "mtl" | "mur" | "mvr" | "mwk" | 
//     "mxn" | "mxv" | "myr" | "mzm" | "mzn" | "nad" | "near" | "neo" | "nexo" | "nft" | "ngn" | "nio" | "nlg" | "nok" | "npr" | "nzd" | 
//     "okb" | "omr" | "one" | "op" | "ordi" | "pab" | "paxg" | "pen" | "pepe" | "pgk" | "php" | "pkr" | "pln" | "pte" | "pyg" | "qar" | 
//     "qnt" | "qtum" | "rol" | "ron" | "rpl" | "rsd" | "rub" | "rune" | "rvn" | "rwf" | "sand" | "sar" | "sbd" | "scr" | "sdd" | "sdg" |
//      "sek" | "sgd" | "shib" | "shp" | "sit" | "skk" | "sle" | "sll" | "snx" | "sol" | "sos" | "spl" | "srd" | "srg" | "std" | "stn" | 
//      "stx" | "sui" | "svc" | "syp" | "szl" | "thb" | "theta" | "tjs" | "tmm" | "tmt" | "tnd" | "ton" | "top" | "trl" | "trx" | "try" | 
//      "ttd" | "tusd" | "tvd" | "twd" | "twt" | "tzs" | "uah" | "ugx" | "uni" | "usd" | "usdc" | "usdd" | "usdp" | "usdt" | "uyu" | 
//      "uzs" | "val" | "veb" | "ved" | "vef" | "ves" | "vet" | "vnd" | "vuv" | "waves" | "wemix" | "woo" | "wst" | "xaf" | "xag" | 
//      "xau" | "xaut" | "xbt" | "xcd" | "xch" | "xdc" | "xdr" | "xec" | "xem" | "xlm" | "xmr" | "xof" | "xpd" | "xpf" | "xpt" | 
//      "xrp" | "xtz" | "yer" | "zar" | "zec" | "zil" | "zmk" | "zmw" | "zwd" | "zwg" | "zwl"

export const availableCurrenciesSet = ["1inch", "aave", "ada", "aed", "afn", "agix", "akt", "algo", "all", "amd", "amp", "ang",
    "aoa", "ape", "apt", "ar", "arb", "ars", "atom", "ats", "aud", "avax", "awg", "axs", "azm", "azn", "bake", "bam",
    "bat", "bbd", "bch", "bdt", "bef", "bgn", "bhd", "bif", "bmd", "bnb", "bnd", "bob", "brl", "bsd", "bsv", "bsw",
    "btc", "btcb", "btg", "btn", "btt", "busd", "bwp", "byn", "byr", "bzd", "cad", "cake", "cdf", "celo", "cfx", "chf",
    "chz", "clp", "cnh", "cny", "comp", "cop", "crc", "cro", "crv", "cspr", "cuc", "cup", "cve", "cvx", "cyp", "czk",
    "dai", "dash", "dcr", "dem", "dfi", "djf", "dkk", "doge", "dop", "dot", "dydx", "dzd", "eek", "egld", "egp", "enj",
    "eos", "ern", "esp", "etb", "etc", "eth", "eur", "fei", "fil", "fim", "fjd", "fkp", "flow", "flr", "frax", "frf",
    "ftt", "fxs", "gala", "gbp", "gel", "ggp", "ghc", "ghs", "gip", "gmd", "gmx", "gnf", "gno", "grd", "grt", "gt",
    "gtq", "gusd", "gyd", "hbar", "hkd", "hnl", "hnt", "hot", "hrk", "ht", "htg", "huf", "icp", "idr", "iep", "ils",
    "imp", "imx", "inj", "inr", "iqd", "irr", "isk", "itl", "jep", "jmd", "jod", "jpy", "kas", "kava", "kcs", "kda",
    "kes", "kgs", "khr", "klay", "kmf", "knc", "kpw", "krw", "ksm", "kwd", "kyd", "kzt", "lak", "lbp", "ldo", "leo",
    "link", "lkr", "lrc", "lrd", "lsl", "ltc", "ltl", "luf", "luna", "lunc", "lvl", "lyd", "mad", "mana", "matic",
    "mbx", "mdl", "mga", "mgf", "mina", "mkd", "mkr", "mmk", "mnt", "mop", "mro", "mru", "mtl", "mur", "mvr", "mwk",
    "mxn", "mxv", "myr", "mzm", "mzn", "nad", "near", "neo", "nexo", "nft", "ngn", "nio", "nlg", "nok", "npr", "nzd",
    "okb", "omr", "one", "op", "ordi", "pab", "paxg", "pen", "pepe", "pgk", "php", "pkr", "pln", "pte", "pyg", "qar",
    "qnt", "qtum", "rol", "ron", "rpl", "rsd", "rub", "rune", "rvn", "rwf", "sand", "sar", "sbd", "scr", "sdd", "sdg",
    "sek", "sgd", "shib", "shp", "sit", "skk", "sle", "sll", "snx", "sol", "sos", "spl", "srd", "srg", "std", "stn",
    "stx", "sui", "svc", "syp", "szl", "thb", "theta", "tjs", "tmm", "tmt", "tnd", "ton", "top", "trl", "trx", "try",
    "ttd", "tusd", "tvd", "twd", "twt", "tzs", "uah", "ugx", "uni", "usd", "usdc", "usdd", "usdp", "usdt", "uyu",
    "uzs", "val", "veb", "ved", "vef", "ves", "vet", "vnd", "vuv", "waves", "wemix", "woo", "wst", "xaf", "xag",
    "xau", "xaut", "xbt", "xcd", "xch", "xdc", "xdr", "xec", "xem", "xlm", "xmr", "xof", "xpd", "xpf", "xpt",
    "xrp", "xtz", "yer", "zar", "zec", "zil", "zmk", "zmw", "zwd", "zwg", "zwl"]


export class CurrencyContextType {
    public constructor(
        public refreshCurrencies: (currency?: string) => void,
        public currencyConversions: (currency: string) => any,
        public loading: boolean,
    ) { }
}

export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = (props: { children: any }) => {

    const currencyApi = useApi(getCurrencies);

    const refresh = (curr?: string) => {
        const currency = curr?.toLowerCase();

        if (currency && !availableCurrenciesSet.includes(currency)) { return; } //Don't waste the API's time
        currencyApi.fetch(undefined, undefined, currency)
    }

    const getCurrencyConversions = (curr: string) => {
        const currency = curr.toLowerCase();

        if (currencyApi.loading) return undefined;
        if (!currencyApi.data[currency]) {
            refresh(currency)
            return undefined
        }

        return currencyApi.data[currency]
    }


    return <CurrencyContext.Provider value={{ loading: currencyApi.data, currencyConversions: getCurrencyConversions, refreshCurrencies: refresh }}>
        {props.children}
    </CurrencyContext.Provider>

}