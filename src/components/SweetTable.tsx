import type { Sweet } from "../api/sweets.api";

type Props = {
  sweets: Sweet[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  // optional actions
  onPurchaseClick?: (sweet: Sweet) => void;
  onRestockClick?: (sweet: Sweet) => void;
  onEditClick?: (sweet: Sweet) => void;
  onDeleteClick?: (sweet: Sweet) => void;
};


export default function SweetsTable({
  sweets,
  page,
  totalPages,
  onPageChange,
  onPurchaseClick,
  onRestockClick,
  onEditClick,
  onDeleteClick,
}: Props) {
  return (
    <div className="space-y-6">
      {/* List */}
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        {/* Header (desktop only) */}
        <div className="hidden md:grid grid-cols-5 gap-4 bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-400">
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
            className="
              border-t border-zinc-800 px-4 py-4
              hover:bg-zinc-900/60 transition
              md:grid md:grid-cols-5 md:gap-4 md:items-center
            "
          >
            {/* Name */}
            <div className="font-medium text-white md:col-span-1">
              {sweet.name}
            </div>

            {/* Mobile details */}
            <div className="mt-1 space-y-1 text-sm text-zinc-400 md:hidden">
              <div>Category: {sweet.category}</div>
              <div className="text-pink-400">
                Price: ₹ {sweet.price}
              </div>
              <div
                className={
                  sweet.quantity > 0
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                Stock: {sweet.quantity}
              </div>
            </div>

            {/* Desktop category */}
            <div className="hidden md:block text-zinc-400">
              {sweet.category}
            </div>

            {/* Desktop price */}
            <div className="hidden md:block text-pink-400">
              ₹ {sweet.price}
            </div>

            {/* Desktop stock */}
            <div
              className={`hidden md:block ${sweet.quantity > 0
                  ? "text-green-400"
                  : "text-red-400"
                }`}
            >
              {sweet.quantity}
            </div>

            {/* Action */}
            <div className="mt-3 md:mt-0 md:text-right flex gap-2 justify-end flex-wrap">
              {onPurchaseClick && (
                <button
                  disabled={sweet.quantity === 0}
                  onClick={() => onPurchaseClick(sweet)}
                  className="rounded bg-pink-600 px-3 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-50"
                >
                  Purchase
                </button>
              )}

              {onRestockClick && (
                <button
                  onClick={() => onRestockClick(sweet)}
                  className="rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                >
                  Restock
                </button>
              )}

              {onEditClick && (
                <button
                  onClick={() => onEditClick(sweet)}
                  className="rounded bg-yellow-600 px-3 py-2 text-sm text-white hover:bg-yellow-700"
                >
                  Edit
                </button>
              )}

              {onDeleteClick && (
                <button
                  onClick={() => onDeleteClick(sweet)}
                  className="rounded bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-zinc-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded border border-zinc-700 px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
