import ChangePassRequest from "../model/requests/auth/ChangePassRequest";
import LoginRequest from "../model/requests/auth/LoginRequest";
import RegisterRequest from "../model/requests/auth/RegisterRequest";
import User from "../model/User";
import { API_PREFIX, Get, Post, Put } from "./Common";

const AUTH_URL = API_PREFIX + "auth/"

export const getUser = (
    setLoading: (value: boolean) => void,
    setItem: (value?: User) => void,
    onError: (value: any) => void
) => Get(setLoading, setItem, onError, AUTH_URL + "me")

export const login = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: LoginRequest
) => Post(setLoading, onSuccess, onError, AUTH_URL + "login", request)

export const logout = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void
) => Get(setLoading, onSuccess, onError, AUTH_URL + "logout")


export const changePassword = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: ChangePassRequest
) => Put(setLoading, onSuccess, onError, AUTH_URL + "password", request)

export const register = (
    setLoading: (value: boolean) => void,
    onSuccess: () => void,
    onError: (value: any) => void,
    request: RegisterRequest
) => Post(setLoading, onSuccess, onError, AUTH_URL + "register", request)