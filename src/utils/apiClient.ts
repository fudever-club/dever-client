import { constants } from "@/settings";
import webStorageClient from "./webStorageClient";
import { isAuthEndpoint, refreshSession } from "./sessionRefresh";

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
  /** Internal: set on the single silent retry to prevent refresh loops. */
  retried?: boolean;
}

const DEFAULT_TIMEOUT_MS = 15000;

export async function apiFetch<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<{ data: T | null; status: number; ok: boolean; error?: string }> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, skipAuth = false, headers = {}, signal, ...restOptions } = options;

  // Resolve target URL
  let fullUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    const base = constants.API_SERVER.endsWith("/")
      ? constants.API_SERVER.slice(0, -1)
      : constants.API_SERVER;
    const path = url.startsWith("/") ? url : `/${url}`;
    fullUrl = `${base}${path}`;
  }

  // Setup abort controller for timeout
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const abortFromCaller = () => controller.abort(signal?.reason);
  if (signal?.aborted) abortFromCaller();
  else signal?.addEventListener("abort", abortFromCaller, { once: true });

  try {
    // Setup headers with Authorization
    const requestHeaders = new Headers(headers);
    if (!skipAuth) {
      const token = webStorageClient.getToken();
      if (token && !requestHeaders.has("Authorization")) {
        requestHeaders.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: requestHeaders,
      signal: controller.signal,
      // Send httpOnly session cookies (omitted for explicitly public calls).
      credentials: skipAuth ? "omit" : "include",
    });

    // One silent refresh attempt before treating 401 as logged-out.
    if (response.status === 401 && !skipAuth && !isAuthEndpoint(fullUrl) && !options.retried) {
      if (await refreshSession()) {
        clearTimeout(timeoutId);
        return apiFetch<T>(url, { ...options, retried: true });
      }
    }

    // Handle 401 Unauthorized globally
    if (response.status === 401 && !skipAuth) {
      webStorageClient.removeAll();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/sign-in") &&
        !window.location.pathname.includes("/sign-up")
      ) {
        const currentPath = window.location.pathname;
        const locale = currentPath.split("/")[1] || "vi";
        window.location.href = `/${locale}/sign-in?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    const contentType = response.headers.get("content-type") || "";
    let data: any = null;
    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
      error: !response.ok ? (data?.message || `Request failed with status ${response.status}`) : undefined,
    };
  } catch (err: any) {
    const isTimeout = timedOut;
    const errorMessage = isTimeout
      ? `Yêu cầu mạng bị quá thời gian (${timeoutMs / 1000}s). Vui lòng thử lại.`
      : (signal?.aborted ? "Request cancelled" : err.message || "Lỗi kết nối máy chủ");

    console.warn("[apiClient Error]:", fullUrl, errorMessage);
    return {
      data: null,
      status: isTimeout ? 408 : signal?.aborted ? 499 : 500,
      ok: false,
      error: errorMessage,
    };
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortFromCaller);
  }
}

export const apiClient = {
  get: <T = any>(url: string, options?: ApiRequestOptions) =>
    apiFetch<T>(url, { ...options, method: "GET" }),

  post: <T = any>(url: string, body?: any, options?: ApiRequestOptions) => {
    const headers = new Headers(options?.headers);
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return apiFetch<T>(url, {
      ...options,
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put: <T = any>(url: string, body?: any, options?: ApiRequestOptions) => {
    const headers = new Headers(options?.headers);
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return apiFetch<T>(url, {
      ...options,
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  patch: <T = any>(url: string, body?: any, options?: ApiRequestOptions) => {
    const headers = new Headers(options?.headers);
    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (!isFormData && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return apiFetch<T>(url, {
      ...options,
      method: "PATCH",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  delete: <T = any>(url: string, options?: ApiRequestOptions) =>
    apiFetch<T>(url, { ...options, method: "DELETE" }),
};

export default apiClient;
