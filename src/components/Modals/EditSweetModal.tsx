import { useState } from "react";
import type { Sweet } from "../../api/sweets.api";

type Props = {
    sweet: Sweet;
    onClose: () => void;
    onConfirm: (data: {
        name: string;
        category: string;
        price: string | number;
        quantity: number;
    }) => Promise<void>;
};

export default function EditSweetModal({
    sweet,
    onClose,
    onConfirm,
}: Props) {
    const [name, setName] = useState(sweet.name);
    const [category, setCategory] = useState(sweet.category);
    const [price, setPrice] = useState(sweet.price);
    const [quantity, setQuantity] = useState(sweet.quantity);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!name.trim() || !category.trim()) {
            setError("Name and category are required");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await onConfirm({
                name,
                category,
                price,
                quantity,
            });
            onClose();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Update failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6">
                <h2 className="text-xl font-semibold text-white">
                    Edit Sweet
                </h2>

                <div className="mt-4 space-y-3">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none"
                    />

                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none"
                    />

                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none"
                    />

                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        placeholder="Quantity"
                        className="w-full rounded bg-zinc-800 px-3 py-2 text-white outline-none"
                    />
                </div>

                {error && (
                    <p className="mt-3 text-sm text-red-500">{error}</p>
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
                        className="rounded bg-yellow-600 px-4 py-2 text-sm text-white hover:bg-yellow-700 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
