import { objectToQueryString } from "../components/shared/Utils";
import Commission from "../model/commission/Commission";
import CommissionAlert from "../model/commission/CommissionAlert";
import CommissionFilterOptions from "../model/commission/CommissionFilterOptions";
import { API_PREFIX, Delete, Get, Post, Put, Upload } from "./Common";

const ENDPOINT = API_PREFIX + "comm/"

export const commHeaderImage = (id: number) => ENDPOINT + `${id}/image`

export const createCommission = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Commission) => void,
    onError: (value: any) => void,
    val: Commission
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getCommissions = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Commission[]) => void,
    onError: (value: any) => void,
    filter?: CommissionFilterOptions
) => Get(setLoading, setItem, onError, ENDPOINT + objectToQueryString(filter));

export const getAlerts = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CommissionAlert[]) => void,
    onError: (value: any) => void,
) => {
    Get(setLoading, setItem, onError, ENDPOINT + "Alerts");
}

export const getCommissionsCount = (
    setLoading: (value: boolean) => void,
    setItem: (value?: { count: number }) => void,
    onError: (value: any) => void,
    filter?: CommissionFilterOptions
) => Get(setLoading, setItem, onError, ENDPOINT + "count" + objectToQueryString(filter));


export const getCommissionYears = (
    setLoading: (value: boolean) => void,
    setItem: (value?: number[]) => void,
    onError: (value: any) => void,
) => Get(setLoading, setItem, onError, ENDPOINT + "years")

export const getCommission = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Commission) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateCommission = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: Commission
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)

export const updateCommissionHeader = (
    setLoading: (value: boolean) => void,
    setProgress: (value: number) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
    file: File
) => Upload(setLoading, setProgress, onSuccess, onError, "PUT", ENDPOINT + `${id}/image`, file)


export const deleteCommission = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
) => Delete(setLoading, onSuccess, onError, ENDPOINT + id)


