import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Profil from "../pages/Profil";
import Chat from "../pages/Chat";
import OtherProfil from "../pages/OtherProfil";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Header from "../components/Header";

export const router = createBrowserRouter([
    {
        path: '/profil',
        element:
            <PrivateRoutes>
                <Header>
                    <Profil />
                </Header>
            </PrivateRoutes>
    },
    {
        path: '/home',
        element:
            <PrivateRoutes>
                <Header>
                    <Home />
                </Header>
            </PrivateRoutes>
    },
    {
        path: '/chat/:id',
        element: <PrivateRoutes>
        <Header>
            <Chat />
        </Header>
    </PrivateRoutes>
    },
    {
        path: '/chat',
        element: <PrivateRoutes>
                <Header>
                    <Chat />
                </Header>
            </PrivateRoutes>
    },
    {
        path: '/profil/:id',
        element: <OtherProfil />
    },
    {
        path: '/login',
        element:
            <Header connected={false}>
                <Login />
            </Header>
        ,
    },
    {
        path: '/register',
        element:
            <Header connected={false}>
                <Register />
            </Header>
        ,
    },
    {
        path: '/404',
        element:
            <Header connected={false}>
                <div>404</div>
            </Header>,
    },
    {
        path: '/*',
        element: <Navigate to='/home' />,
    }
])
