import { useSnackbar } from "notistack";
import { useUser } from "../../hooks/useUser";
import { changePassword } from "../../../api/Auth";
import useApi from "../../hooks/useApi";
import { useEffect, useState } from "react";
import ChangePassRequest from "../../../model/requests/auth/ChangePassRequest";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, TextField } from "@mui/material";
import ApiAlert from "../../shared/ApiAlert";

export default function ChangePassModal(props: {
    open: boolean,
    setOpen: (val: boolean) => void
}) {

    const { open, setOpen } = props
    const { refreshAuth } = useUser();
    const { enqueueSnackbar } = useSnackbar();
    const changePassApi = useApi(changePassword);

    const [password, setPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")

    useEffect(() => {
        setNewPassword("")
        setPassword("")
    }, [open])

    const handleClick = () => {
        changePassApi.fetch(onSuccess, undefined, {
            newPassword: newPassword,
            oldPassword: password
        } as ChangePassRequest)
    }

    const onSuccess = () => {
        setOpen(false);
        enqueueSnackbar("Password changed!", { variant: "success" })
        refreshAuth();
    }



    return <Dialog open={open} maxWidth={"xs"} fullWidth onClose={() => setOpen(false)}>
        <DialogContent>
            <ApiAlert result={changePassApi.error} style={{ marginBottom: "20px" }} />
            <div style={{ display: "flex" }}>
                <div style={{ textAlign: 'center' }}>
                    <img src="icon.png" width={64} />
                </div>
                <hr style={{ margin: "0 20px" }} />
                <div style={{ flex: 1 }}>
                    <div>
                        <TextField
                            fullWidth placeholder="Current Password" variant="standard" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ marginTop: "10px" }}>
                        <TextField
                            fullWidth placeholder="New Password" variant="standard" type="password"
                            value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </DialogContent>
        <DialogActions>
            {
                (changePassApi.loading)
                    ? <CircularProgress size={25} />
                    : <Button onClick={handleClick}>Change Password</Button>
            }

        </DialogActions>
    </Dialog>

}