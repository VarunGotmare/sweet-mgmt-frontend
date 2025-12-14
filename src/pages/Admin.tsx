import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";

import { getAllSweets } from "../api/sweets.api";
import type { Sweet } from "../api/sweets.api";

import QuantityModal from "../components/Modals/QuantityModal";
import { restockSweet } from "../api/sweets.api";

import { deleteSweet } from "../api/sweets.api";
import ConfirmModal from "../components/Modals/ConfirmModal";

import EditSweetModal from "../components/Modals/EditSweetModal";
import { updateSweet } from "../api/sweets.api";


import SweetsTable from "../components/SweetTable";

const LIMIT = 10;

export default function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);

  const [sweetToDelete, setSweetToDelete] = useState<Sweet | null>(null);

  const [sweetToEdit, setSweetToEdit] = useState<Sweet | null>(null);



  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRestock = async (quantity: number) => {
    if (!selectedSweet) return;

    const toastId = toast.loading("Restocking...");

    try {
      const res = await restockSweet(selectedSweet.id, quantity);

      setSweets((prev) =>
        prev.map((s) =>
          s.id === selectedSweet.id
            ? { ...s, quantity: res.updatedQuantity }
            : s
        )
      );

      toast.success(
        `Restocked ${quantity} ${selectedSweet.name}`,
        { id: toastId }
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Restock failed",
        { id: toastId }
      );
    }
  };

  const handleDelete = async () => {
    if (!sweetToDelete) return;

    const toastId = toast.loading("Deleting sweet...");

    try {
      await deleteSweet(sweetToDelete.id);

      // Optimistic UI update
      setSweets((prev) =>
        prev.filter((s) => s.id !== sweetToDelete.id)
      );

      toast.success("Sweet deleted", { id: toastId });
      setSweetToDelete(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Delete failed",
        { id: toastId }
      );
    }
  };

  const handleEditSweet = async (data: {
    name: string;
    category: string;
    price: string | number;
    quantity: number;
  }) => {
    if (!sweetToEdit) return;

    const toastId = toast.loading("Updating sweet...");

    try {
      const updated = await updateSweet(sweetToEdit.id, data);

      setSweets((prev) =>
        prev.map((s) =>
          s.id === sweetToEdit.id ? updated : s
        )
      );

      toast.success("Sweet updated", { id: toastId });
      setSweetToEdit(null);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Update failed",
        { id: toastId }
      );
    }
  };


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
      setError(
        err.response?.data?.message || "Failed to load sweets"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6 text-white">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-pink-500">
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

      {/* Content */}
      {loading && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-zinc-400">Loading sweets...</p>
        </div>
      )}

      {error && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {!loading && !error && sweets.length === 0 && (
        <div className="flex h-[60vh] items-center justify-center">
          <p className="text-zinc-400">No sweets found 🍬</p>
        </div>
      )}

      {!loading && !error && sweets.length > 0 && (
        <SweetsTable
          sweets={sweets}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          onRestockClick={setSelectedSweet}
          onDeleteClick={setSweetToDelete}
          onEditClick={setSweetToEdit}
        />
      )}
      {selectedSweet && (
        <QuantityModal
          title={`Restock ${selectedSweet.name}`}
          description={`Current stock: ${selectedSweet.quantity}`}
          confirmText="Restock"
          onClose={() => setSelectedSweet(null)}
          onConfirm={handleRestock}
        />
      )}

      {sweetToDelete && (
        <ConfirmModal
          title="Delete Sweet"
          description={`Are you sure you want to delete "${sweetToDelete.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onCancel={() => setSweetToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {sweetToEdit && (
        <EditSweetModal
          sweet={sweetToEdit}
          onClose={() => setSweetToEdit(null)}
          onConfirm={handleEditSweet}
        />
      )}

    </div>
  );
}
