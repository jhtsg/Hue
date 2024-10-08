import { Backdrop, CircularProgress } from "@mui/material";

export default function LoadingBackdrop(props: { loading?: boolean }) {

    return <Backdrop open={props.loading ?? false}>
        <CircularProgress color={'secondary'} />
    </Backdrop>

}