import api from "./axios";

export type LogType = "purchase" | "restock";

export type LogItem = {
    id: string;
    type: LogType;
    sweet: {
        id: string;
        name: string;
    };
    quantity: number;
    actor: {
        id: string;
        name: string;
    };
    createdAt: string;
};

export type LogsResponse = {
    data: LogItem[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

type GetLogsParams = {
    type?: "all" | "purchase" | "restock";
    page?: number;
    limit?: number;
};

export async function getLogs(params: GetLogsParams) {
    const res = await api.get<LogsResponse>("/api/logs", {
        params,
    });

    return res.data;
}
