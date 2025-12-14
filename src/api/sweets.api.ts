import api from "./axios";

export type Sweet = {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
};

export type SweetSearchParams = {
  name?: string;
  category?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
};

//pagination for optimizaztion
export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedSweetsResponse = {
  data: Sweet[];
  pagination: Pagination;
};


//get all sweets

export async function getAllSweets(
    page = 1,
    limit = 10
): Promise<PaginatedSweetsResponse> {
  const res = await api.get<PaginatedSweetsResponse>("/api/sweets",{
    params: { page, limit },
  });
  return res.data;
}

//search sweets

export async function searchSweets(
  params: SweetSearchParams & {
    page?: number;
    limit?: number;
  }
): Promise<PaginatedSweetsResponse> {
  const res = await api.get<PaginatedSweetsResponse>("/api/sweets/search", {
    params,
  });
  return res.data;
}

//admin apis
//create sweet

export async function createSweet(payload: {
  name: string;
  category: string;
  price: string | number;
  quantity: number;
}): Promise<Sweet> {
  const res = await api.post<Sweet>("/api/sweets", payload);
  return res.data;
}

//update sweet

export async function updateSweet(
  sweetId: string,
  payload: Partial<{
    name: string;
    category: string;
    price: string | number;
    quantity: number;
  }>
): Promise<Sweet> {
  const res = await api.put<Sweet>(`/api/sweets/${sweetId}`, payload);
  return res.data;
}

//detelte swweet

export async function restockSweet(
  sweetId: string,
  quantity: number
): Promise<{ updatedQuantity: number }> {
  const res = await api.post<{ updatedQuantity: number }>(
    `/api/sweets/${sweetId}/restock`,
    { quantity }
  );
  return res.data;
}
