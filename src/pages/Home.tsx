import { useEffect, useState } from "react";
import { getAllSweets, searchSweets, purchaseSweet } from "../api/sweets.api";
import type { Sweet } from "../api/sweets.api";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import SweetsTable from "../components/SweetTable";
import SweetsSearch from "../components/SweetSearch";
import QuantityModal from "../components/Modals/QuantityModal";

const LIMIT = 10;

export default function Home() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  /*fetch sweets */

  useEffect(() => {
    fetchSweets(page);
  }, [page, searchName, searchCategory]);

  const fetchSweets = async (pageNumber: number) => {
    try {
      setLoading(true);

      const hasSearch =
        searchName.trim() !== "" || searchCategory.trim() !== "";

      const res = hasSearch
        ? await searchSweets({
            name: searchName || undefined,
            category: searchCategory || undefined,
            page: pageNumber,
            limit: LIMIT,
          })
        : await getAllSweets(pageNumber, LIMIT);

      setSweets(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sweets");
    } finally {
      setLoading(false);
    }
  };

  //reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchName, searchCategory]);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleConfirmPurchase = async (quantity: number) => {
    if (!selectedSweet) return;

    const toastId = toast.loading("Processing purchase...");

    try {
      const res = await purchaseSweet(selectedSweet.id, quantity);

      setSweets((prev) =>
        prev.map((s) =>
          s.id === selectedSweet.id
            ? { ...s, quantity: res.remainingQuantity }
            : s
        )
      );

      toast.success(
        `Purchased ${quantity} ${selectedSweet.name}`,
        { id: toastId }
      );

      //close modal after success
      setSelectedSweet(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Purchase failed",
        { id: toastId }
      );
    }
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

      {/* Search */}
      <SweetsSearch
        name={searchName}
        category={searchCategory}
        onNameChange={setSearchName}
        onCategoryChange={setSearchCategory}
        onClear={() => {
          setSearchName("");
          setSearchCategory("");
        }}
      />

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
        <SweetsTable
          sweets={sweets}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onPurchaseClick={setSelectedSweet}
        />
      )}

      {/* Purchase Modal */}
      {selectedSweet && (
        <QuantityModal
          title={`Purchase ${selectedSweet.name}`}
          description={`Available stock: ${selectedSweet.quantity}`}
          confirmText="Purchase"
          maxQuantity={selectedSweet.quantity}
          onClose={() => setSelectedSweet(null)}
          onConfirm={handleConfirmPurchase}
        />
      )}
    </div>
  );
}
