import CharacterCategory from "../model/character/CharacterCategory";
import { API_PREFIX, Get, Post, Put } from "./Common";

const ENDPOINT = API_PREFIX + "char/category/"

export const createCharacterCategory = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CharacterCategory) => void,
    onError: (value: any) => void,
    val: CharacterCategory
) => Post(setLoading, setItem, onError, ENDPOINT, val)

export const getCharacterCategories = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CharacterCategory[]) => void,
    onError: (value: any) => void,
) => Get(setLoading, setItem, onError, ENDPOINT)

export const getCharacterCategory = (
    setLoading: (value: boolean) => void,
    setItem: (value?: CharacterCategory) => void,
    onError: (value: any) => void,
    id: number,
) => Get(setLoading, setItem, onError, ENDPOINT + id)

export const updateCharacterCategory = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    val: CharacterCategory
) => Put(setLoading, onSuccess, onError, ENDPOINT, val)


