import {
    createBrowserRouter,
} from "react-router-dom";
import Home from "../pages/Home";
import Profil from "../pages/Profil";
import Chat from "../pages/Chat";
import OtherProfil from "../pages/OtherProfil";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoutes />,
        children: [
            {
                path: '/profil',
                element: <Profil />
            },
            {
                path: '/chat',
                element: <Chat />
            },
            {
                path: '/profil/:id',
                element: <OtherProfil />
            },
        ]
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    }])