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
    NEXT_NUMBER: "/api/invoice/next-number",
  },

  AI: {
    PARSE_INVOICE_TEXT: "/api/ai/parse-text",
    GENERATE_REMINDER: "/api/ai/generate-reminder",
    GET_DASHBOARD_SUMMARY: "/api/ai/dashboard-summary",
  },

  PRODUCT: {
    CREATE: "/api/products/",
    GET_ALL_PRODUCTS: "/api/products/",
    GET_PRODUCT_BY_ID: (id) => `/api/products/${id}`,
    UPDATE_PRODUCTS: (id) => `/api/products/${id}`,
    DELETE_PRODUCTS: (id) => `/api/products/${id}`,
  },
};
