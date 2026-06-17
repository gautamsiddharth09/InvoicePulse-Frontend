import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstances";
import { API_PATHS } from "../utils/apiPaths";


// get all invoice
export const getAllInvoices = createAsyncThunk(
  "invoice/getAllInvoices",
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INVOICE.GET_ALL_INVOICES,
      );

      return response.data.invoices;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch invoices",
      );
    }
  },
);


// get single invoice
export const getInvoiceById = createAsyncThunk(
  "invoice/getInvoiceById",
  async (id, thunkAPI) => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.INVOICE.GET_INVOICE_BY_ID(id),
      );

      return response.data.invoice;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch invoice",
      );
    }
  },
);
 console.log("response")
// create invoice
export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoiceData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.INVOICE.CREATE,
        invoiceData,
      );
     
      return response.data.invoice;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to create invoice",
      );
    }
  },
);


// invoice update
export const updateInvoice = createAsyncThunk(
  "invoice/updateInvoice",
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.INVOICE.UPDATE_INVOICE(id),
        invoiceData,
      );

      return response.data.invoice;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update invoice",
      );
    }
  },
);

// invoice delete
export const deleteInvoice = createAsyncThunk(
  "invoice/deleteInvoice",
  async (id, thunkAPI) => {
    try {
      await axiosInstance.delete(API_PATHS.INVOICE.DELETE_INVOICE(id));

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete invoice",
      );
    }
  },
);


// initial State
const initialState = {
  invoices: [],
  currentInvoice: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
};

// slice
const invoiceSlice = createSlice({
  name: "invoice",
  initialState,

  reducers: {
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    },

    clearInvoiceError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // get all
      .addCase(getAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(getAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //  get invoice by id
      .addCase(getInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(getInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //  create invoice
      .addCase(createInvoice.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.createLoading = false;
        state.currentInvoice = action.payload;
        state.invoices.unshift(action.payload);
      })
      .addCase(createInvoice.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })
      // update invoice
      .addCase(updateInvoice.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateInvoice.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.currentInvoice = action.payload;
        state.invoices = state.invoices.map((invoice) =>
          invoice._id === action.payload._id ? action.payload : invoice,
        );
      })
      .addCase(updateInvoice.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload;
      })
    //  delete invoice
      .addCase(deleteInvoice.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.invoices = state.invoices.filter(
          (invoice) => invoice._id !== action.payload,
        );
      })
      .addCase(deleteInvoice.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentInvoice, clearInvoiceError } = invoiceSlice.actions;

export default invoiceSlice.reducer;
