import { NavLink, Outlet } from "react-router-dom";
import { queryClient } from "../main";
import { fetchHome, fetchSettings } from "../lib/fetchData";
import { useRef } from "react";

export function Sidebar() {
  const drawerCheckbox = useRef<HTMLInputElement>(null);

  const closeDrawer = () => {
    if (window.innerWidth < 1024 && drawerCheckbox.current) {
      drawerCheckbox.current.checked = false;
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" ref={drawerCheckbox} />
      <div className="drawer-content">
        <Outlet />
        <label htmlFor="drawer" className="btn btn-square btn-ghost absolute left-2 top-2 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div className="my-4 flex justify-center">
            <img src="/kodi-logo.webp" alt="logo" width={50} height={50} />
            <h1 className="text-4xl mt-2" style={{ fontFamily: "Helvetica-rounded-bold" }} >EpiKodi</h1>
          </div>
          <li>
            <NavLink
              to="/"
              end
              onClick={closeDrawer}
              onMouseOver={() => queryClient.prefetchQuery('home', fetchHome)}
              className={({ isActive }) =>
                isActive ? "bg-base-300 hover:bg-base-300 focus:bg-base-300" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/browse"
              end
              onClick={closeDrawer}
              className={({ isActive }) =>
                isActive ? "bg-base-300 hover:bg-base-300 focus:bg-base-300" : ""
              }
            >
              Browse
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              onClick={closeDrawer}
              onMouseOver={() => queryClient.prefetchQuery('settings', fetchSettings)}
              className={({ isActive }) =>
                isActive ? "bg-base-300 hover:bg-base-300 focus:bg-base-300" : ""
              }
            >
              Settings
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
