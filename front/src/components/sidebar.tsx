import { NavLink, Outlet } from "react-router-dom";
import { queryClient } from "../main";
import { fetchHome, fetchSettings } from "../lib/fetchData";

export function Sidebar() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
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
              onMouseOver={() => queryClient.prefetchQuery('home', fetchHome)}
              className={({ isActive }) =>
                isActive ? "bg-base-300" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              onMouseOver={() => queryClient.prefetchQuery('settings', fetchSettings)}
              className={({ isActive }) =>
                isActive ? "bg-base-300" : ""
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
