import CommissionTag from "../model/commission/CommissionTag";
import { API_PREFIX, Delete, Get, Post, Put } from "./Common";

const ENDPOINT = API_PREFIX + "comm/tag/"

export const createCommTag = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CommissionTag) => void,
    onError: (value: any) => void,
    val: CommissionTag
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getCommTags = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CommissionTag[]) => void,
    onError: (value: any) => void,
) => Get(setLoading, setItem, onError, ENDPOINT)

export const getCommTag = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CommissionTag) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateCommTag = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: CommissionTag
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)


export const deleteCommTag = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
) => Delete(setLoading, onSuccess, onError, ENDPOINT + id)
