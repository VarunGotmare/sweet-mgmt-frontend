import { useState } from "react";

type Props = {
  title: string;
  description?: string;
  confirmText: string;
  maxQuantity?: number;
  onClose: () => void;
  onConfirm: (quantity: number) => Promise<void>;
};

export default function QuantityModal({
  title,
  description,
  confirmText,
  maxQuantity,
  onClose,
  onConfirm,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (quantity <= 0) {
      setError("Quantity must be at least 1");
      return;
    }

    if (maxQuantity && quantity > maxQuantity) {
      setError("Quantity exceeds allowed limit");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onConfirm(quantity);
      onClose();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Action failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-lg bg-zinc-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-sm text-zinc-400">
            {description}
          </p>
        )}

        <div className="mt-4">
          <label className="block text-sm text-zinc-400 mb-1">
            Quantity
          </label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={loading}
            className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
