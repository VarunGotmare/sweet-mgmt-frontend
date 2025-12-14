import type { Sweet } from "../api/sweets.api";

type Props = {
  sweets: Sweet[];
};

export default function SweetList({ sweets }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800">
      {/* Header row */}
      <div className="grid grid-cols-5 gap-4 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-400">
        <span>Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span className="text-right">Action</span>
      </div>

      {/* Rows */}
      {sweets.map((sweet) => (
        <div
          key={sweet.id}
          className="grid grid-cols-5 gap-4 border-t border-zinc-800 px-4 py-3 items-center hover:bg-zinc-900/60 transition"
        >
          <span className="font-medium text-white">{sweet.name}</span>

          <span className="text-zinc-400">{sweet.category}</span>

          <span className="text-pink-400">₹ {sweet.price}</span>

          <span
            className={sweet.quantity > 0 ? "text-green-400" : "text-red-400"}
          >
            {sweet.quantity}
          </span>

          <div className="text-right">
            <button
              disabled={sweet.quantity === 0}
              className="rounded bg-pink-600 px-3 py-1.5 text-sm text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Purchase
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
