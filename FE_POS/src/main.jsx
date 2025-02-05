import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App";
import Receipt from "./cashier/components/Receipt.jsx";
// pages
import Login from "./auth/Login.jsx";
import NotFound from "./admin/page/NotFound.jsx";

import { store, persistor } from "./store.js";

const router = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      //cashier
      {
        path: "/cashier",
        element: <App />,
      },
      {
        path: "/order-history",
        element: <App />,
      },
      {
        path: "/confirmation-order",
        element: <App />,
      },
      //logistik
      {
        path: "/item",
        element: <App />,
      },
      {
        path: "/material",
        element: <App />,
      },
      {
        path: "/category",
        element: <App />,
      },
      //admin
      {
        path: "/transaction",
        element: <App />,
      },
      {
        path: "/user-setting",
        element: <App />,
      },
      {
        path: "/oprational-staff",
        element: <App />,
      },
      {
        path: "/oprational-admin",
        element: <App />,
      },
      {
        path: "/sales",
        element: <App />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/receipt",
    element: <Receipt />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
