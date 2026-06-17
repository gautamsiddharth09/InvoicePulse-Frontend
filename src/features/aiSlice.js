// features/aiSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstances";
import { API_PATHS } from "../utils/apiPaths";

export const parseInvoiceText = createAsyncThunk(
  "ai/parseInvoiceText",
  async (text, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.PARSE_INVOICE_TEXT,
        { text }
      );

      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to parse invoice"
      );
    }
  }
);

export const generateReminder = createAsyncThunk(
  "ai/generateReminder",
  async (invoiceId, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_REMINDER,
        { invoiceId }
      );

      return response.data.reminderText;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to generate reminder"
      );
    }
  }
);

const aiSlice = createSlice({
  name: "ai",

  initialState: {
    parsedInvoice: null,
    reminderText: "",
    loading: false,
    error: null,
  },

  reducers: {
    clearReminder: (state) => {
      state.reminderText = "";
    },

    clearParsedInvoice: (state) => {
      state.parsedInvoice = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(parseInvoiceText.pending, (state) => {
        state.loading = true;
      })

      .addCase(parseInvoiceText.fulfilled, (state, action) => {
        state.loading = false;
        state.parsedInvoice = action.payload;
      })

      .addCase(parseInvoiceText.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(generateReminder.pending, (state) => {
        state.loading = true;
      })

      .addCase(generateReminder.fulfilled, (state, action) => {
        state.loading = false;
        state.reminderText = action.payload;
      })

      .addCase(generateReminder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearReminder,
  clearParsedInvoice,
} = aiSlice.actions;

export default aiSlice.reducer;