import { api } from "./axios";
export async function get<T>(url: string) {
  const response = await api.get<T>(url);

  return response.data;
}

export async function post<TResponse, TData = unknown>(
  url: string,
  data: TData,
) {
  const response = await api.post<TResponse>(url, data);

  return response.data;
}

export async function patch<TResponse, TData = unknown>(
  url: string,
  data: TData,
) {
  const response = await api.patch<TResponse>(url, data);

  return response.data;
}



export async function remove<T>(
  url: string,
) {
  const response = await api.delete<T>(url,);

  return response.data;
}

