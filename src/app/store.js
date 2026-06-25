import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import invoiceReducer from "../features/invoiceSlice"
import aiReducer from "../features/aiSlice";
import productReducer from "../features/productSlice"

export const store = configureStore({
  reducer : {
    auth : authReducer,
    invoice: invoiceReducer,
    ai: aiReducer,
    products: productReducer
  }
})