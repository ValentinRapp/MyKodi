import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import './assets/tailwind.css';
import { Home } from "./router/Home";
import { Settings } from "./router/Settings";
import { Media } from "./router/Media";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Sidebar />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/settings",
        element: <Settings />
      },
    ]
  },
  {
    path: "/media/:mediaName",
    element: <Media />
  }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
