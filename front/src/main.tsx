import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import './assets/tailwind.css';
import { Home } from "./router/Home";
import { Settings } from "./router/Settings";
import { Media } from "./router/Media";
import { QueryClient, QueryClientProvider } from "react-query";

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

export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
