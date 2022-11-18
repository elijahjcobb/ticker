import { APIError } from "../api-helpers/api-error";

function baseUrl(): string {
  if (process.env.NODE_ENV === "production") return "https://acorn.social";
  else return "http://localhost:3000";
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

  const fullUrl = `${baseUrl()}/api${url}`;
  const res = await fetch(fullUrl, {
    method,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
    ...authHeaders,
  });
  const text = await res.text();
  const json = JSON.parse(text);
  console.log(
    `${method.toUpperCase()} ${fullUrl}: (${res.status}) ${
      text.length
    } bytes -\n${text}`
  );
  if (throwOnHTTPError && !res.ok) throw new APIError(res.status, json.error);
  return json;
}
