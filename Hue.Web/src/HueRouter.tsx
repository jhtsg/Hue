import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./components/pages/home/HomePage";
import CharsPage from "./components/pages/chars/CharsPage";
import ArtistsPage from "./components/pages/artists/ArtistsPage";
import CommsPage from "./components/pages/comms/CommsPage";
import ArtistPage from "./components/pages/artists/ArtistPage";
import CharPage from "./components/pages/chars/CharPage";
import CommPage from "./components/pages/comms/CommPage";
import CommSearchPage from "./components/pages/commSearch/CommSearchPage";

export const HueRouter = createBrowserRouter([{
    path: "/",
    element: <App />,
    //This is where we put the 404
    // errorElement: <NotFoundPage />,
    children: [

        { path: '/', element: <HomePage /> },

        { path: '/characters', element: <CharsPage /> },
        { path: '/characters/:id', element: <CharPage /> },
        { path: '/artists', element: <ArtistsPage /> },
        { path: '/artists/:id', element: <ArtistPage /> },
        { path: '/search', element: <CommSearchPage /> },
        { path: '/commissions', element: <CommsPage /> },
        { path: '/commissions/:id', element: <CommPage /> },

    ]


}])