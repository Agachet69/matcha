import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './index.css'
import { router } from './utils/Router.jsx'
import {
  RouterProvider,
} from "react-router-dom";
import { persistor, store } from './store/store.js';
import {Provider, useDispatch, useSelector} from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <PersistGate loading={<div style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "35px",
      }}> MATCHA </div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
)
