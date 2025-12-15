import { useEffect, useState } from "react";
import { getLogs } from "../../api/logs.api";
import type { LogItem } from "../../api/logs.api";

type SortOrder = "desc" | "asc";
type LogType = "all" | "purchase" | "restock";

export default function AdminTransactions() {
    const [logs, setLogs] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [type, setType] = useState<LogType>("all");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchLogs();
    }, [page, type, sortOrder]);

    const fetchLogs = async () => {
        try {
            setLoading(true);

            const res = await getLogs({ page, limit, type });

            let data = res.data;
            if (sortOrder === "asc") data = [...data].reverse();

            setLogs(data);
            setTotalPages(res.pagination.totalPages);
        } catch (err) {
            console.error("Failed to load logs", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Page Title */}
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Transactions
            </h2>

            {/* Filters */}
            <div className="mb-4 flex flex-wrap items-center gap-4">
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value as LogType);
                        setPage(1);
                    }}
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">All</option>
                    <option value="purchase">Purchases</option>
                    <option value="restock">Restocks</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) =>
                        setSortOrder(e.target.value as SortOrder)
                    }
                    className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="desc">Newest first</option>
                    <option value="asc">Oldest first</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {/* Header */}
                <div className="grid grid-cols-5 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600">
                    <span>Type</span>
                    <span>Sweet</span>
                    <span>Quantity</span>
                    <span>Actor</span>
                    <span>Date</span>
                </div>

                {/* Rows */}
                {loading ? (
                    <p className="px-4 py-6 text-sm text-gray-500">
                        Loading transactions…
                    </p>
                ) : logs.length === 0 ? (
                    <p className="px-4 py-6 text-sm text-gray-500">
                        No transactions found
                    </p>
                ) : (
                    logs.map((log) => (
                        <div
                            key={log.id}
                            className="grid grid-cols-5 items-center border-t px-4 py-2 text-sm text-gray-700"
                        >
                            <span
                                className={
                                    log.type === "purchase"
                                        ? "text-green-600"
                                        : "text-blue-600"
                                }
                            >
                                {log.type}
                            </span>
                            <span>{log.sweet.name}</span>
                            <span>{log.quantity}</span>
                            <span>{log.actor.name}</span>
                            <span className="text-gray-500">
                                {new Date(log.createdAt).toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center gap-4">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                    Prev
                </button>

                <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
