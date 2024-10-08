import { useWindowDimensions } from "../hooks/useWindowDimensions";

export default function CenterLoading() {

    const { vertical } = useWindowDimensions();

    return <div style={{ margin: "0 auto", width: "64px", display: "flex", height: "100%", justifyContent: "center", flexDirection: "column", padding: vertical ? "40px 0px" : "0px" }}>
        <img src="loading.gif" />
        <div style={{ marginTop: "20px", textAlign: "center" }}>Loading</div>
    </div>
}