import { constants } from "@/settings";
import webStorageClient from "./webStorageClient";

export interface ApiRequestOptions extends RequestInit {
  timeoutMs?: number;
  skipAuth?: boolean;
}

const DEFAULT_TIMEOUT_MS = 15000;

export async function apiFetch<T = any>(
  url: string,
  options: ApiRequestOptions = {}
): Promise<{ data: T | null; status: number; ok: boolean; error?: string }> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, skipAuth = false, headers = {}, ...restOptions } = options;

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
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  // Setup headers with Authorization
  const requestHeaders = new Headers(headers);
  if (!skipAuth) {
    const token = webStorageClient.getToken();
    if (token && !requestHeaders.has("Authorization")) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const response = await fetch(fullUrl, {
      ...restOptions,
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle 401 Unauthorized globally
    if (response.status === 401) {
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
      data = await response.json().catch(() => null);
    } else {
      data = await response.text().catch(() => null);
    }

    return {
      data,
      status: response.status,
      ok: response.ok,
      error: !response.ok ? (data?.message || `Request failed with status ${response.status}`) : undefined,
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === "AbortError";
    const errorMessage = isTimeout
      ? `Yêu cầu mạng bị quá thời gian (${timeoutMs / 1000}s). Vui lòng thử lại.`
      : (err.message || "Lỗi kết nối máy chủ");

    console.warn("[apiClient Error]:", fullUrl, errorMessage);
    return {
      data: null,
      status: isTimeout ? 408 : 500,
      ok: false,
      error: errorMessage,
    };
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
