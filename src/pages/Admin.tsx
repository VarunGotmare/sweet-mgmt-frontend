import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 space-y-4">
        <h1 className="text-2xl font-bold text-pink-500 text-center">
          Admin Dashboard (Mock)
        </h1>

        <div className="text-center text-zinc-300">
          <p>Welcome,</p>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-zinc-400">{user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded bg-red-600 py-2 font-semibold text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
