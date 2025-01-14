import Service from "../model/artist/Service";
import { API_PREFIX, Delete, Get, Post, Put } from "./Common";

const ENDPOINT = API_PREFIX + "service/"

export const createService = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Service) => void,
    onError: (value: any) => void,
    val: Service
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getServices = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Service[]) => void,
    onError: (value: any) => void,
    options?: { artistId?: number, commType?: number }
) => Get(setLoading, setItem, onError, ENDPOINT + (options ? `?${Object.keys(options).map(a => `${a}=${(options as any)[a]}`).join("&")}` : ""))

export const getService = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Service) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateService = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: Service
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)


export const deleteService = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
) => Delete(setLoading, onSuccess, onError, ENDPOINT + id)