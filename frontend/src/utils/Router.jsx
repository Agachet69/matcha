import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Profil from "../pages/Profil";
import Chat from "../pages/Chat";
import OtherProfil from "../pages/OtherProfil";
import { PrivateRoutes } from "./PrivateRoutes";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import Header from "../components/Header";
import "../App.css";
import Modals from "../components/Modals";
import ForgotPassword from "../pages/ForgotPassword";

export const router = createBrowserRouter([
  {
    path: "/profil",
    element: (
      <PrivateRoutes>
        <Modals>
          <Header>
            <Profil />
          </Header>
        </Modals>
      </PrivateRoutes>
    ),
  },
  {
    path: "/home",
    element: (
      <PrivateRoutes>
        <Modals>
          <Header>
            <Home />
          </Header>
        </Modals>
      </PrivateRoutes>
    ),
  },
  {
    path: "/chat/:id",
    element: (
      <PrivateRoutes>
        <Modals>
          <Header>
            <Chat />
          </Header>
        </Modals>
      </PrivateRoutes>
    ),
  },
  {
    path: "/chat",
    element: (
      <PrivateRoutes>
        <Modals>
          <Header>
            <Chat />
          </Header>
        </Modals>
      </PrivateRoutes>
    ),
  },
  {
    path: "/profil/see",
    element: (
      <PrivateRoutes>
        <Modals>
          <Header>
            <OtherProfil />
          </Header>
        </Modals>
      </PrivateRoutes>
    ),
  },
  {
    path: "/login",
    element: (
      <Modals>
        <Header connected={false}>
          <Login />
        </Header>
      </Modals>
    ),
  },
  {
    path: "/register",
    element: (
      <Header connected={false}>
        <Register />
      </Header>
    ),
  },
  {
    path: "/verify_email",
    element: (
      <Header connected={false} logout={true}>
        <VerifyEmail />
      </Header>
    ),
  },
  {
    path: "/forgot_password",
    element: (
      <Header connected={false}>
        <ForgotPassword />
      </Header>
    ),
  },

  {
    path: "/404",
    element: (
      <Header connected={false}>
        <div>404</div>
      </Header>
    ),
  },
  {
    path: "/*",
    element: <Navigate to="/home" />,
  },
]);
