import useSWR from "swr";
import { APIError } from "../api-helpers/api-error";

export function useFetch<T, E>(url: string) {
  return useSWR<T, E>(
    url,
    async (url: string, method: "post" | "get" | "delete" | "put") => {
      const res = await fetch(url, {
        method,
      });
      const json = await res.json();

      if (!res.ok) {
        throw new APIError(res.status, json.error);
      }

      return json;
    }
  );
}

export async function fetcher<T extends object>({
  url,
  method = "get",
  body,
  token,
  throwOnHTTPError = true,
}: {
  url: string;
  token?: string;
  body?: object;
  method?: "post" | "get" | "delete" | "put";
  throwOnHTTPError?: boolean;
}): Promise<T> {
  let authHeaders = {};

  if (token) {
    authHeaders = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
  }

  const res = await fetch(`http://localhost:3000/api${url}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    ...authHeaders,
  });
  const json = await res.json();
  if (throwOnHTTPError && !res.ok) throw new APIError(res.status, json.error);
  return json;
}
