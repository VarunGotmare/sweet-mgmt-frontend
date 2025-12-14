import { useEffect, useState } from "react";
import { getAllSweets } from "../api/sweets.api";
import type { Sweet } from "../api/sweets.api";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

import SweetGrid from "../components/SweetGrid";

const LIMIT = 10;

export default function Home() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets(page);
  }, [page]);

  const fetchSweets = async (pageNumber: number) => {
    try {
      setLoading(true);
      const res = await getAllSweets(pageNumber, LIMIT);

      setSweets(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-pink-500">
          Available Sweets
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="rounded border border-red-500 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-lg text-zinc-400">Loading sweets...</p>
        </div>
      )}

      {error && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && sweets.length === 0 && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-zinc-400">No sweets available 🍬</p>
        </div>
      )}

      {!loading && !error && sweets.length > 0 && (
        <>
          <SweetGrid sweets={sweets} />

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
