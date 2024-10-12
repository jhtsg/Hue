import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { usePingPong } from "./components/hooks/usePingPong";
import { useUser } from "./components/hooks/useUser";
import PingPongPage from "./components/pages/pingPong/PingPongPage";
import LoginPage from "./components/pages/login/LoginPage";

export default function App() {

  const { pong } = usePingPong();
  const { user } = useUser();

  return <>
    <Navbar />
    <div style={{ margin: "80px auto 0px auto", width: "95%" }}>
      {!pong ? <PingPongPage /> :
        !user ? <LoginPage /> : <Outlet />}
    </div>
  </>
}

