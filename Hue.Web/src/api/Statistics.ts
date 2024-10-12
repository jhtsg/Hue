import AtAGlance from "../model/statistics/AtAGlance";
import MonthlyPriceCat from "../model/statistics/MonthlyPriceCat";
import MonthlySpend from "../model/statistics/MonthlySpend";
import MonthlyStatus from "../model/statistics/MonthlyStatus";
import Statistic from "../model/statistics/Statistic";
import { API_PREFIX, Get } from "./Common";

const ENDPOINT = API_PREFIX + "stats/"

export const getGlance = (
    setLoading: (value: boolean) => void,
    setItem: (value?: AtAGlance) => void,
    onError: (value: any) => void,
    year?: number
) => Get(setLoading, setItem, onError, ENDPOINT + "glance" + (year ? `?year=${year}` : ''))

export const getPriceCats = (
    setLoading: (value: boolean) => void,
    setItem: (value?: MonthlyPriceCat) => void,
    onError: (value: any) => void,
    year: number
) => Get(setLoading, setItem, onError, ENDPOINT + "priceCat/" + year)

export const getSpending = (
    setLoading: (value: boolean) => void,
    setItem: (value?: MonthlySpend) => void,
    onError: (value: any) => void,
    year: number
) => Get(setLoading, setItem, onError, ENDPOINT + "spending/" + year)

export const getStatuses = (
    setLoading: (value: boolean) => void,
    setItem: (value?: MonthlyStatus) => void,
    onError: (value: any) => void,
    year: number
) => Get(setLoading, setItem, onError, ENDPOINT + "status/" + year)

const getStatistics = (
    item: string
) => (
    setLoading: (value: boolean) => void,
    setItem: (value?: Statistic) => void,
    onError: (value: any) => void,
    year?: number
) => Get(setLoading, setItem, onError, ENDPOINT + item + (year ? `?year=${year}` : ''))

const getStatisticForItem = (
    item: string
) => (
    setLoading: (value: boolean) => void,
    setItem: (value?: Statistic) => void,
    onError: (value: any) => void,
    id: number,
    year?: number
) => Get(setLoading, setItem, onError, ENDPOINT + item + "/" + id + (year ? `?year=${year}` : ''))

export const getArtistStatistics = getStatistics('artist');
export const getCharacterStatistics = getStatistics('characters');
export const getTagStatistics = getStatistics('tag');

export const getStatisticForArtist = getStatisticForItem('artist');
export const getStatisticForCharacter = getStatisticForItem('characters');
export const getStatisticForTag = getStatisticForItem('tag');