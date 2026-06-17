export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    GET_PROFILE: "/api/auth/me",
    UPDATE_PROFILE: "/api/auth/me",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },

  INVOICE: {
    CREATE: "/api/invoice/create",
    GET_ALL_INVOICES: "/api/invoice/",
    GET_INVOICE_BY_ID: (id) => `/api/invoice/${id}`,
    UPDATE_INVOICE: (id) => `/api/invoice/${id}`,
    DELETE_INVOICE: (id) => `/api/invoice/${id}`,
  },

  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text",
    GENERATE_REMINDER: "/api/ai/generate-reminder",
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary",
  },
};
