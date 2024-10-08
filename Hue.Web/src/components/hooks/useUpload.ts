import { useState } from 'react'

//I should've designed this ages ago

export class Upload<T> {
    public constructor(
        /** Indicates whether or not the API is loading */
        public loading: boolean,

        /** Progress (0-100)*/
        public progress: number,

        /** Data from the last time the API was fetched. This is cleared after initiating any fetch */
        public data: T,

        /** Error form the last time the API was fetched. This is cleared after initiating any fetch */
        public error: any,

        /**Resets the data back to undefined */
        public resetData: () => void,

        /**Resets the error back to undefined */
        public resetError: () => void,

        /** Tell Fido to Fetch */
        public fetch: (

            /** Callback function that'll occur on success */
            onSuccess?: (
                /** Data retrieved from the API */
                val?: T
            ) => void,

            /** Callback function that'll occur on error */
            onError?: (
                /** Error return from the API */
                val?: any
            ) => void,

            /** Arguments for the API call */
            ...args: any) => void
    ) { }
}

export default function useUpload<T>(

    /**API function to use */
    uploadFunc: (
        setLoading: (value: boolean) => void,
        setProgress: (value: number) => void,
        onSuccess: () => void,
        onError: (value: any) => void,
        ...args: any
    ) => void,


) {

    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [data, setData] = useState(undefined as any as T)
    const [error, setError] = useState(undefined as any as T)

    const resetData = () => setData(undefined as any as T)
    const resetError = () => setError(undefined as any)

    const fetch = (
        onSuccess?: (val?: T) => void,
        onError?: (val?: any) => void,
        ...args: any
    ) => {
        resetData()
        resetError()
        setProgress(0)
        uploadFunc(setLoading, setProgress,
            onSuccess
                ? (val?: T) => { onSuccess(val); setData(val ?? undefined as any) }
                : (val?: T) => { setData(val ?? undefined as any) },
            onError ? (val: any) => {
                setError(val)
                if (val !== undefined) {
                    console.error(val)
                    onError(val)
                }
            } : setError,
            ...args
        )
    }


    return { loading, progress, data, error, resetData, resetError, fetch } as Upload<T>;

}


