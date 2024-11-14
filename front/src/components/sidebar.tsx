import { NavLink, Outlet } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <Outlet />
        <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
          Open drawer
        </label>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          <div className="my-4 flex justify-center">
            <img src="/kodi-logo.webp" alt="logo" width={50} height={50} />
            <h1 className="text-4xl mt-2" style={{fontFamily: "Helvetica-rounded-bold"}} >EpiKodi</h1>
          </div>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "active text-primary" : ""
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "active text-primary" : ""
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
