// lib/api.ts
import axios from "axios";
import { useAuthStore } from "@/store/auth";

export const api = axios.create({
  baseURL: "https://fe-test-api.nwappservice.com",
});

api.interceptors.request.use((config) => {
  const user = useAuthStore.getState().user;
  if (user?.token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.request.use((cfg) => {
  console.log("[API request]", cfg.method, cfg.url, cfg.headers, cfg.data);
  return cfg;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[API error]", err?.response?.status, err?.response?.data, err?.config?.url);
    return Promise.reject(err);
  }
);
