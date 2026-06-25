import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstances";
import { API_PATHS } from "../utils/apiPaths";

// create product
export const createProduct = createAsyncThunk(
  "product/create",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(
        API_PATHS.PRODUCT.CREATE,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// get all products
export const getProducts = createAsyncThunk(
  "product/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.PRODUCT.GET_ALL_PRODUCTS
      );

      return res.data.products;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// get product by id
export const getProductById = createAsyncThunk(
  "product/getOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(
        API_PATHS.PRODUCT.GET_PRODUCT_BY_ID(id)
      );

      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// update product
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(
        API_PATHS.PRODUCT.UPDATE_PRODUCTS(id),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// delete product
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(
        API_PATHS.PRODUCT.DELETE_PRODUCTS(id)
      );

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

// initalstate
const initialState = {
  products: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    clearProductState: (state) => {
      state.product = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

    //  create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload); // new product at top
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    //  get all  product
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    // get proudct by id
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

// update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );

        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  // delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;

        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductState } = productSlice.actions;

export default productSlice.reducer;