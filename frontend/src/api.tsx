import axios, { type AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  (err: AxiosError) => {
    if (
      err.response?.status === 401 &&
      !err.config?.url?.includes("/auth/login")
    ) {
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);

interface ApiErrorBody {
  message?: string;
  errors?: {
    field: string;
    message: string;
  }[];
}

export const errorMessage = (err: unknown): string => {
  const axErr = err as AxiosError<ApiErrorBody>;
  const data = axErr.response?.data;

  return (
    data?.errors?.map((e) => e.message).join(", ") ||
    data?.message ||
    "Something went wrong"
  );
};

export default api;