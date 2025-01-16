import { objectToQueryString } from "../components/shared/Utils";
import CommissionAssociatedImage from "../model/commission/CommissionAssociatedImage";
import { API_PREFIX, Delete, Get, Upload } from "./Common";

const ENDPOINT = API_PREFIX + "commImage/"

export const commAssociatedImage = (id: number) => ENDPOINT + `${id}`

export const createCommissionAssociatedImage = (
    setLoading: (value: boolean) => void,
    setProgress: (value: number) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    file: File,
    additionalData: {
        type: number,
        notes: string,
        commId: number,
    }
) => Upload(setLoading, setProgress, onSuccess, onError, "POST", ENDPOINT, file, additionalData)

export const getCommissionAssociatedImages = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CommissionAssociatedImage[]) => void,
    onError: (value: any) => void,
    commId: number,
    commType: number,
) => Get(setLoading, setItem, onError, ENDPOINT + objectToQueryString({ commId: commId, type: commType }));

export const deleteCommissionAssociatedImage = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
) => Delete(setLoading, onSuccess, onError, ENDPOINT + id)


