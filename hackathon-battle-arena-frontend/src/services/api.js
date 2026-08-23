import axios from "axios";
import { API_URL } from "../utils/constants";
import { getAccessToken, setAccessToken, clearAccessToken } from "../utils/storage";
import { ERROR_MESSAGES } from "../utils/constants";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // send the HTTP-only refresh cookie
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Normalizes every backend error into a plain Error whose `.message` is
 * already user-friendly, and whose `.code`/`.status`/`.details` are
 * attached for callers that want more context.
 */
function toAppError(error) {
  const status = error.response?.status;
  const body = error.response?.data;
  const code = body?.code;
  const friendly = (code && ERROR_MESSAGES[code]) || body?.message || error.message || "Something went wrong.";
  const appError = new Error(friendly);
  appError.code = code;
  appError.status = status;
  appError.details = body?.details;
  return appError;
}

// Access-token refresh: queue concurrent 401s behind a single refresh call.
let isRefreshing = false;
let refreshQueue = [];

function subscribeToRefresh(callback) {
  refreshQueue.push(callback);
}

function notifyRefreshed(token) {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

let onAuthFailure = null;
export function registerAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isAuthRoute = originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/register");

    if (status === 401 && !originalRequest?._retry && !isAuthRoute && !originalRequest?.url?.includes("/auth/refresh")) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeToRefresh((token) => {
            if (!token) {
              reject(toAppError(error));
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await api.post("/auth/refresh");
        const newToken = data?.data?.accessToken;
        setAccessToken(newToken);
        notifyRefreshed(newToken);
        isRefreshing = false;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        notifyRefreshed(null);
        clearAccessToken();
        onAuthFailure?.();
        return Promise.reject(toAppError(refreshError));
      }
    }

    return Promise.reject(toAppError(error));
  }
);

/** Unwraps the backend's { success, data } envelope. */
export function unwrap(response) {
  return response.data?.data;
}

export default api;
