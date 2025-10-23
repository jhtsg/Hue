import { Button, Card, Checkbox, CircularProgress, FormControlLabel, FormGroup, Tab, Tabs, TextField } from "@mui/material";
import { useWindowDimensions } from "../../hooks/useWindowDimensions"
import { useUser } from "../../hooks/useUser";
import { useState } from "react";
import { useSnackbar } from "notistack";
import useApi from "../../hooks/useApi";
import { login, register } from "../../../api/Auth";
import ApiAlert from "../../shared/ApiAlert";
import RegisterRequest from "../../../model/requests/auth/RegisterRequest";
import LoginRequest from "../../../model/requests/auth/LoginRequest";
import LoadingBackdrop from "../../shared/LoadingBackdrop";
import { usePingPong } from "../../hooks/usePingPong";
import WelcomePane from "./subcomponents/WelcomePane";
import { Warning } from "@mui/icons-material";


export default function LoginPage() {

    const { vertical, maxComponentHeight } = useWindowDimensions();
    const { loading } = useUser();

    return <>
        <div style={vertical ? {} : { display: "flex", flexDirection: "row-reverse" }}>
            <div style={{ width: vertical ? "100%" : "500px" }}>
                <LoginPanel />
                {!vertical && <Footer />}
            </div>
            <div style={vertical
                ? { marginTop: "20px" }
                : { flex: "1", marginRight: "20px", maxHeight: maxComponentHeight + 20, overflowY: "auto" }}
            >
                <WelcomePane />
            </div>
            {vertical && <Footer />}
        </div>

        <LoadingBackdrop loading={loading} />
    </>
}

function Footer() {

    const { pong } = usePingPong();


    return <div style={{ textAlign: 'center', fontSize: ".75em", color: '#999', marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "left", marginBottom: "20px" }}>
            <img src="/tsg.png" width={64} style={{ marginRight: "20px" }} />
            <div>
                <div>(C)2025 TheSlimeGuy</div>
                <div>No Rights Reserved</div>
            </div>

        </div>

        <hr />
        <div style={{ display: "flex", marginTop: "10px", flexWrap: "wrap" }}>
            <div style={{ width: "50%" }}>
                <div>Server running since</div>
                <div>{new Date(pong?.startupTime ?? 0).toLocaleString()}</div>
            </div>
            <div style={{ width: "50%" }}>
                <div>Last ping pong game took</div>
                <div>{(new Date(pong?.dbPingPong?.pingTime ?? 0).getTime() - new Date(pong?.dbPingPong?.pongTime ?? 0).getTime()) / 1000} seconds</div>
            </div>
            {pong?.dbPingPong?.up && <div style={{ width: "100%", marginTop: "10px" }}>
                <div>Last DB ping pong game took</div>
                <div>{(new Date(pong?.dbPingPong?.pingTime ?? 0).getTime() - new Date(pong?.dbPingPong?.pongTime ?? 0).getTime()) / 1000} seconds</div>
            </div>}

        </div>
    </div>
}

function LoginPanel() {
    const [value, setValue] = useState(0);
    const { enqueueSnackbar } = useSnackbar();
    const { pong, refreshPing, loading: pingPongLoading } = usePingPong();


    const { refreshAuth } = useUser();
    const loginApi = useApi(login);
    const registerApi = useApi(register)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [regKey, setRegKey] = useState("")
    const [isArtist, setIsArtist] = useState(false);

    const handleChange = (_: any, newValue: number) => setValue(newValue);

    const handleClick = () => {
        if (value === 1) {
            registerApi.fetch(onRegisterSuccess, undefined, {
                username: username,
                password: password,
                registrationKey: regKey,
                isArtist: isArtist
            } as RegisterRequest)
        } else {
            loginApi.fetch(onLoginSuccess, undefined, {
                username: username,
                password: password
            } as LoginRequest)
        }
    }

    const onRegisterSuccess = () => {
        loginApi.fetch(onLoginSuccess, undefined, {
            username: username,
            password: password
        } as LoginRequest)
    }

    const onLoginSuccess = () => {
        enqueueSnackbar("Logged in!", { variant: "success" })
        refreshAuth();
    }

    const anyLoading = loginApi.loading || registerApi.loading;

    if (!pong?.dbPingPong?.up && !pingPongLoading) {
        return <Card style={{ height: "300px" }}>
            <div style={{
                height: "100%",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
            }}>
                <div style={{ color: "yellow" }}><Warning fontSize="large" /></div>
                <div><b>There's been a database issue</b></div>
                <div style={{ marginTop: "0px", fontSize: ".8em", color: "#CCC", maxWidth: "300px", textAlign: "center" }}>
                    The backend was unable to contact the DB. Contact this instance's administrator
                </div>
                <Button style={{ marginTop: "15px" }} variant="contained" onClick={() => refreshPing()}>Retry</Button>
            </div>
        </Card>

    }

    return <Card style={{ minHeight: "300px" }}>
        <div style={{ padding: "10px" }}><Tabs value={value} onChange={handleChange}
            variant="scrollable"
        >
            <Tab label="Log In" value={0} />
            <Tab label="Register" value={1} />
        </Tabs>
        </div>
        <div style={{ padding: "20px" }}>
            <ApiAlert result={value === 1 ? registerApi.error : loginApi.error} style={{ marginBottom: "20px" }} />
            <div>
                <TextField
                    label="Username" fullWidth variant="filled"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => {
                        //Login on enter hit if we have a password and we're in login mode
                        if (e.key === 'Enter' && password.length > 0 && value === 0) {
                            handleClick();
                        }
                    }}
                />
            </div>
            <div style={{ marginTop: "20px" }}>
                <TextField
                    label="Password" fullWidth variant="filled" type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        //Login on enter hit if we have a username and we're in login mode
                        if (e.key === 'Enter' && username.length > 0 && value === 0) {
                            handleClick();
                        }
                    }}
                />
            </div>
            <div hidden={value !== 1}>
                <div style={{ marginTop: "20px", textAlign: "right" }}>
                    <TextField
                        label="Registration Key" fullWidth variant="filled" type="password"
                        value={regKey}
                        onChange={(e) => setRegKey(e.target.value)}
                    />
                </div>
                <div style={{ marginTop: "20px" }}>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={isArtist} onChange={(e) => setIsArtist(e.target.checked)} />}
                            label={<>
                                <div>I am an artist</div>
                                <div style={{ fontSize: ".8em", color: "#999999" }}>I am an artist using Hue to track my own commissions</div>
                            </>}
                        />
                    </FormGroup>
                </div>
            </div>
            <div style={{ marginTop: "20px", textAlign: "right" }}>
                <Button variant='contained' disabled={anyLoading} onClick={handleClick}>
                    {anyLoading
                        ? <CircularProgress size={25} color="inherit" />
                        : value === 0 ? 'Log In' : 'Register'
                    }
                </Button>
            </div>
        </div>

    </Card>


}