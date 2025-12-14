import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pink-500">
            Admin Dashboard
          </h1>
          <p className="text-sm text-zinc-400">
            {user?.name} · {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-fit rounded border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 px-6">
        <nav className="flex gap-6 text-sm">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `py-3 border-b-2 ${
                isActive
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`
            }
          >
            Sweets
          </NavLink>

          <NavLink
            to="/admin/transactions"
            className={({ isActive }) =>
              `py-3 border-b-2 ${
                isActive
                  ? "border-pink-500 text-pink-500"
                  : "border-transparent text-zinc-400 hover:text-white"
              }`
            }
          >
            Transactions
          </NavLink>
        </nav>
      </div>

      {/* Page Content */}
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}
