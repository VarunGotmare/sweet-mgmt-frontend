type Props = {
    title: string;
    description?: string;
    confirmText?: string;
    onCancel: () => void;
    onConfirm: () => Promise<void>;
};

export default function ConfirmModal({
    title,
    description,
    confirmText = "Confirm",
    onCancel,
    onConfirm,
}: Props) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-full max-w-sm rounded-lg bg-zinc-900 p-6">
                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2 text-sm text-zinc-400">
                        {description}
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded px-4 py-2 text-sm text-zinc-400 hover:text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
