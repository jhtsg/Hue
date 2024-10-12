import Character from "../model/character/Character";
import { API_PREFIX, Get, Post, Put, Upload } from "./Common";

const ENDPOINT = API_PREFIX + "char/"

export const characterImage = (id: number) => ENDPOINT + `${id}/image`

export const createCharacter = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Character) => void,
    onError: (value: any) => void,
    val: Character
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getCharacters = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Character[]) => void,
    onError: (value: any) => void,
) => Get(setLoading, setItem, onError, ENDPOINT)

export const getCharacter = (
    setLoading: (value: boolean) => void,
    setItem: (value?: Character) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateCharacter = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: Character
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)

export const updatePrimaryCharacter = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: Character
) => Put(setLoading, onSuccess, onError, ENDPOINT + "primary", val)

export const updateCharacterProfile = (
    setLoading: (value: boolean) => void,
    setProgress: (value: number) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    id: number,
    file: File
) => Upload(setLoading, setProgress, onSuccess, onError, "PUT", ENDPOINT + `${id}/image`, file)



