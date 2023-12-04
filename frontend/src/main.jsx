import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import { router } from './utils/Router.jsx'
import {
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <App />
  </React.StrictMode>
)
