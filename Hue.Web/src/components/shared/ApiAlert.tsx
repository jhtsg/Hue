import { Alert, AlertColor } from "@mui/material"
import { CSSProperties } from "react"

export default function ApiAlert(props: {
    result?: any
    style?: CSSProperties
}) {

    const { result, style } = props

    const status = result?.status as number;

    let message = undefined as any as string;
    let variant = undefined as any as AlertColor;

    switch (status) {
        case 200:
        case 201:
        case 202:
        case 203:
        case 204:
            variant = "success"
            break;
        case 404:
            variant = "warning"
            message = "The requested item was not found!"
            break;
        case 400:
            variant = "warning"
            break;
        case 401:
            variant = "error"
            message = "Please log in to access this resource"
            break;
        case 403:
            variant = "error"
            message = "You do not have permission to access this resource"
            break;
        case 500:
            variant = "error"
            message = "There was an issue in the backend and we couldn't handle your request"
            break;
        case 999:
            variant = "error"
            message = "There was an issue in the frontend and we couldn't handle your request"
            break;
        default:
            variant = "error"
            break;
    }

    if (!result) return <></>

    return <div style={style}>
        <Alert severity={variant}>
            {message ?? result?.detail ?? result?.message ?? "Something happened"}
        </Alert>
    </div>

}