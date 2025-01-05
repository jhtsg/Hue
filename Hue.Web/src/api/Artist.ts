import Artist from "../model/artist/Artist";
import { API_PREFIX, Delete, Get, Post, Put, Upload } from "./Common";

const ENDPOINT = API_PREFIX + "artist/"

export const artistImage = (id: number) => ENDPOINT + `${id}/image`

export const createArtist = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Artist) => void,
    onError: (value: any) => void,
    val: Artist
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getArtists = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Artist[]) => void,
    onError: (value: any) => void,
) => Get(setLoading, setItem, onError, ENDPOINT)

export const getArtist = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Artist) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateArtist = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: Artist
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)

export const updateArtistProfile = (
    setLoading: (value: boolean) => void,
    setProgress: (value: number) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
    file: File
) => Upload(setLoading, setProgress, onSuccess, onError, "PUT", ENDPOINT + `${id}/image`, file)


export const deleteArtist = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
) => Delete(setLoading, onSuccess, onError, ENDPOINT + id)