import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `btn btn-ghost justify-start font-medium ${isActive ? "bg-primary/10 text-primary" : "text-base-content/70"}`;

export default function Navbar() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/90 backdrop-blur-xl">
      <div className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="navbar-start">
          <button className="btn btn-ghost btn-square lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle navigation">
            {mobileOpen ? "✕" : "☰"}
          </button>
          <Link to="/" className="group flex items-center gap-3 no-underline" onClick={closeMobile}>
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-content font-black shadow-lg shadow-primary/20">SR</span>
            <span className="hidden sm:block">
              <span className="block text-lg font-extrabold tracking-tight">Store Ratings</span>
              <span className="block text-[11px] uppercase tracking-[0.18em] text-base-content/45">Management Portal</span>
            </span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          {user && (
            <ul className="menu menu-horizontal gap-1 p-0">
              {user.role === "ADMIN" && <>
                <li><NavLink to="/admin" className={navClass}>Dashboard</NavLink></li>
                <li><NavLink to="/admin/users" className={navClass}>Users</NavLink></li>
                <li><NavLink to="/admin/stores" className={navClass}>Stores</NavLink></li>
                <li><NavLink to="/admin/add-user" className={navClass}>Add User</NavLink></li>
                <li><NavLink to="/admin/add-store" className={navClass}>Add Store</NavLink></li>
              </>}
              {user.role === "USER" && <li><NavLink to="/stores" className={navClass}>Stores</NavLink></li>}
              {user.role === "OWNER" && <li><NavLink to="/owner" className={navClass}>My Store</NavLink></li>}
            </ul>
          )}
        </div>

        <div className="navbar-end gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost gap-2 rounded-xl" aria-label="Open user menu">
                <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary font-bold">{user.name.charAt(0).toUpperCase()}</span>
                <span className="hidden md:block text-left"><span className="block max-w-32 truncate text-sm font-bold">{user.name}</span><span className="badge badge-ghost badge-xs">{user.role}</span></span>
                <span className="text-xs">⌄</span>
              </button>
              <ul className="menu dropdown-content z-[60] mt-3 w-60 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-2xl">
                <li className="menu-title"><span>Account</span></li>
                <li><NavLink to="/password">Change Password</NavLink></li>
                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login?role=OWNER" className="btn btn-ghost rounded-xl">Store Owner</Link>
                <Link to="/login" className="btn btn-primary rounded-xl px-5">Login</Link>
              </div>
              <Link to="/login" className="btn btn-primary btn-sm rounded-xl sm:hidden">Login</Link>
            </>
          )}
        </div>
      </div>

      {mobileOpen && user && (
        <div className="border-t border-base-300 bg-base-100 px-4 py-3 lg:hidden">
          <ul className="menu gap-1 p-0">
            {user.role === "ADMIN" && <>
              <li><NavLink to="/admin" onClick={closeMobile}>Dashboard</NavLink></li>
              <li><NavLink to="/admin/users" onClick={closeMobile}>Users</NavLink></li>
              <li><NavLink to="/admin/stores" onClick={closeMobile}>Stores</NavLink></li>
              <li><NavLink to="/admin/add-user" onClick={closeMobile}>Add User</NavLink></li>
              <li><NavLink to="/admin/add-store" onClick={closeMobile}>Add Store</NavLink></li>
            </>}
            {user.role === "USER" && <li><NavLink to="/stores" onClick={closeMobile}>Stores</NavLink></li>}
            {user.role === "OWNER" && <li><NavLink to="/owner" onClick={closeMobile}>My Store</NavLink></li>}
            <li><NavLink to="/password" onClick={closeMobile}>Change Password</NavLink></li>
            <li><button onClick={handleLogout} className="text-error">Logout</button></li>
          </ul>
        </div>
      )}
    </header>
  );
}
