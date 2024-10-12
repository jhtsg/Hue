import { useEffect } from "react";
import { usePingPong } from "../../hooks/usePingPong";
import ApiAlert from "../../shared/ApiAlert";

export default function PingPongPage() {

    const { error, refreshPing } = usePingPong();

    useEffect(() => {
        if (error) {
            setTimeout(() => {
                refreshPing()
                console.log("Serving")
            }, 10000)
        }
    }, [error])

    return <div style={{ textAlign: 'center' }}>
        <div><img src="/pingpong.gif" alt="Two cats playing ping pong" /></div>
        <p>{error ? "The server didn't pong! Serving another ball in 10 seconds..." : "Spinning up the server...."}</p>
        <div style={{ width: "700px", margin: "0 auto" }}>
            <ApiAlert result={error} style={{ marginTop: "20px" }} />
        </div>
    </div>

}