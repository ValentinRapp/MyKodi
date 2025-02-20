import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Sidebar } from "./components/sidebar";
import './assets/tailwind.css';
import { Home } from "./router/Home";
import { Settings } from "./router/Settings";
import { Media } from "./router/Media";
import { QueryClient, QueryClientProvider } from "react-query";
import { Player } from "./router/Player";
import { Browse } from "./router/Browse";
import { Toaster } from "sonner";

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
        path: "/browse",
        element: <Browse />
      },
      {
        path: "/settings",
        element: <Settings />
      },
    ]
  },
  {
    path: "/media/:mediaName",
    element: <Media />,
  },
  {
    path: "/media/:mediaName/play",
    element: <Player />
  }
]);

export const queryClient = new QueryClient();

function ThemeHandler() {
  
  document.querySelector('html')
  ?.setAttribute('data-theme', localStorage.getItem('theme') || 'dracula')

  window.addEventListener("storage", () => {
    
    console.log('storage event');

    document.querySelector('html')
    ?.setAttribute('data-theme', localStorage.getItem('theme') || 'dracula')
  });
  
  return null;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeHandler />
    <Toaster richColors position="top-center"/>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
