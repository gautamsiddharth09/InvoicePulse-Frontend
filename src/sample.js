// I recently completed a project for Arjun Mehta from Noida. Please create an invoice.
// My company is TechNova Solutions, located at 45 MG Road, Bengaluru, Karnataka 560001. My contact email is accounts@technova.in and phone number is 9123456780.
// The project included a custom website development service worth ₹35,000, a UI/UX design package worth ₹12,000, and 6 months of website maintenance at ₹2,000 per month.
// Apply 18% GST on all services, give an 8% discount on the subtotal, add ₹1,500 as service charges, and mark ₹10,000 as already paid.
// The customer's email is arjun.mehta@gmail.com and phone number is 9876541230.
// Create a professional invoice with all calculations and show the remaining balance due
// -------------------------------------------------------------------------------------------------------------

// Generate an invoice for the following order:
// Business Name: Ushan Cloud
// Business Email: [gautamsiddharth2013@gmail.com](mailto:gautamsiddharth2013@gmail.com)
// Business Phone: 7808233110
// Business Address: Patna, Bihar
// Customer Name: Rahul Kumar
// Customer Email: [rahul@gmail.com](mailto:rahul@gmail.com)
// Customer Phone: 9876543210
// Customer Address: Muzaffarpur, Bihar
// Invoice Number: INV-2026-001
// Invoice Date: 16/06/2026
// Due Date: 30/06/2026

// Products:
// 1. Product Name: Wireless Mouse
//    Product Code: WM-101
//    Quantity: 2
//    MRP Price: 800
//    Discount: 10%
//    Selling Price: 720

// 2. Product Name: Mechanical Keyboard
//    Product Code: MK-202
//    Quantity: 1
//    MRP Price: 3500
//    Discount: 5%
//    Selling Price: 3325

// Shipping Charge: 100
// Tax Rate: 18% (included in selling price)
// Payment Terms: Net 15
// Status: Unpaid
// Generate a professional invoice and calculate:





// ----------------------------------------------------------------------------------------------------------------------


const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
  },

  unitPrice: {
    type: Number,
    required: true,
  },

  taxPercent: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invoiceNumber: {
      type: String,
      unique: true,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },
    
    dueDate: {
      type: Date,
    },

    billFrom: {
      businessName: String,
      email: String,
      address: String,
      phone: String,
    },

    billTo: {
      clientName: String,
      email: String,
      address: String,
      phone: String,
    },

    items: [itemSchema],

    notes: {
      type: String,
    },

    paymentTerms: {
      type: String,
      default: "Net 15",
    },

    status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    taxTotal: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Invoice", invoiceSchema);

// ---------------------------------------------
// invoice controller
const Invoice = require("../models/Invoice");

// create Inovice
const createInvoice = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = req.user;

    const {
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
    } = req.body;

 if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ 
      message: "Items are required"
     });
    }

    // subtotal calculation
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subtotal + taxTotal;
     const invoiceNumber = `INV-${Date.now()}`;

    const invoice = await Invoice.create({
      user: user._id,
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      subtotal,
      taxTotal,
      total,
    });

    res.status(201).json({
      message: "Invoice created successfully",
      invoice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating invoice",
      error: error.message,
    });
  }
};

// Get All Invoices
const getAllInvoices = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const invoices = await Invoice.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get Invoices Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// getInvoiceById
const getInvoiceById = async (req, res) => {
  try {

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;
    console.log("invoice id", req.params.id);
    console.log("user id", req.user._id);

    const invoice = await Invoice.findOne({
      _id: id,
      user: req.user._id,
    });

    // console.log("invoice", invoice);

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    return  res.status(200).json({
      success: true,
      invoice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching invoice",
      error: error.message,
    });
  }
};

// update Invoice
const updateInvoice = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    // why i am using findone becoz every one can not update, update it only correct user
    const invoice = await Invoice.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!invoice) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }

    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      billFrom,
      billTo,
      items,
      notes,
      paymentTerms,
      status,
    } = req.body;

    // if item is empty means true, if it is valid use it  otherwise keep old item
    const finalItems =
      items && Array.isArray(items) && items.length > 0
        ? items
        : invoice.items;

    // recalculate if total changed
    let subtotal = 0;
    let taxTotal = 0;

    finalItems.forEach((item) => {
      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;
      taxTotal += (itemTotal * (item.taxPercent || 0)) / 100;
    });

    const total = subtotal + taxTotal;

   
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: id, user: req.user._id },
      {
        invoiceNumber,
        invoiceDate,
        dueDate,
        billFrom,
        billTo,
        items: finalItems,
        notes,
        paymentTerms,
        status,
        subtotal,
        taxTotal,
        total,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating invoice",
      error: error.message,
    });
  }
};

// delete Invoice
const deleteInvoice = async (req, res) => {
  try {

    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

        const { id } = req.params;

    const deleted = await Invoice.findOneAndDelete({
      _id: id,
      user: user._id,
    });


    if (!deleted) {
      return res.status(404).json({
        message: "Invoice not found",
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
   return res.status(500).json({
      message: "Error deleting invoice",
      error: error.message,
    });
  }
};

module.exports = { createInvoice,getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice };
// --------------------------------------------------

// invoice slice import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
// -----------------------------------------------------------------
// create invoice
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";

import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
  clearCurrentInvoice,
} from "../../features/invoiceSlice";

// create invoice
const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const aiData = location.state?.aiData;

  // console.log("aiData", aiData)

  const params = useParams();
  const id = params.id;
  const isEditMode = Boolean(id);

  console.log("invoice id", id);
  console.log("isEditMode", isEditMode);

  const { user } = useSelector((state) => state.auth);
  console.log("user", user);
  const { currentInvoice, loading, createLoading, updateLoading } = useSelector(
    (state) => state.invoice,
  );

  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 15",
    invoiceNumber: "INV-1001",

    billFrom: {
      businessName: "",
      email: "",
      phone: "",
      address: "",
    },

    billTo: {
      clientName: "",
      email: "",
      phone: "",
      address: "",
    },

    items: [
      {
        name: "",
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
      },
    ],

    notes: "",
  });

  // data coming from ai
  useEffect(() => {
  if (!aiData) return;

  setFormData((prev) => ({
    ...prev,

    billTo: {
      clientName: aiData.clientName || "",
      email: aiData.email || "",
      phone: "",
      address: aiData.address || "",
    },

    items:
      aiData.items?.map((item) => ({
        name: item.name || "",
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        taxPercent: 0,
      })) || prev.items,
  }));
}, [aiData]);


  // auto bill form
  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      billFrom: {
        businessName: user.businessName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      },
    }));
  }, [user]);

  // edit
  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }

    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

  // populate form
  useEffect(() => {
    if (!currentInvoice || !isEditMode) return;

    setFormData({
      invoiceDate: currentInvoice.invoiceDate?.split("T")[0] || "",

      dueDate: currentInvoice.dueDate?.split("T")[0] || "",

      paymentTerms: currentInvoice.paymentTerms || "Net 15",

      invoiceNumber: currentInvoice.invoiceNumber || "",

      billFrom: currentInvoice.billFrom,

      billTo: currentInvoice.billTo,

      items: currentInvoice.items,

      notes: currentInvoice.notes || "",
    });
  }, [currentInvoice, isEditMode]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle nested change
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // add item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      ],
    }));
  };

  // delete item
  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter(
      (_, itemIndex) => itemIndex !== index,
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // total
  const { subtotal, taxTotal, total } = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;

    formData.items.forEach((item) => {
      const itemTotal =
        Number(item.quantity || 0) * Number(item.unitPrice || 0);

      subtotal += itemTotal;

      taxTotal += itemTotal * (Number(item.taxPercent || 0) / 100);
    });

    return {
      subtotal,
      taxTotal,
      total: subtotal + taxTotal,
    };
  }, [formData.items]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.billTo.clientName.trim()) {
      return toast.error("Client name is required");
    }

    if (!formData.billTo.email.trim()) {
      return toast.error("Client email is required");
    }

    try {
      const payload = {
        ...formData,
        subtotal,
        taxTotal,
        total,
      };

      if (isEditMode) {
        await dispatch(
          updateInvoice({
            id,
            invoiceData: payload,
          }),
        ).unwrap();

        toast.success("Invoice updated successfully");
      } else {
        await dispatch(createInvoice(payload)).unwrap();

        toast.success("Invoice created successfully");
      }

      navigate("/invoices");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };


  if (loading && isEditMode) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#12D6C3]" size={40} />
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* headers */}
        <div className="flex flex-col md:flex-row justify-between items-center  gap-4">
          <div>
            <h1 className="text-3xl font-bold  text-gray-600">
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h1>

            <p className=" text-gray-600">
              Create and manage professional invoices
            </p>
          </div>

          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className="px-6 py-3 rounded-xl bg-[#12D6C3] cursor-pointer text-white  font-semibold flex items-center gap-2 hover:opacity-90"
          >
            {(createLoading || updateLoading) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}

            <Save className="w-4 h-4" />

            {isEditMode ? "Update Invoice" : "Save Invoice"}
          </button>
        </div>

        {/* invoice card info */}
        <div className="backdrop-blur-xl border border-slate-300 rounded-3xl p-6 bg-white">
          <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-slate-300">
            {/* invoice */}
            <div>
              <label className="block  text-gray-900 mb-2">Invoice Date</label>

              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              />
            </div>

            {/* due date */}
            <div>
              <label className="block  text-gray-900  mb-2">Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              />
            </div>

            {/* payments terms */}
            <div>
              <label className="block  text-gray-900  mb-2">
                Payment Terms
              </label>

              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              >
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Due on Receipt</option>
              </select>
            </div>
          </div>
        </div>

        {/* bill form and bill to */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* bill form */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill From
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block  text-gray-900  mb-2">
                  Business Name
                </label>
                <input
                  value={formData.billFrom.businessName}
                  onChange={(e) =>
                    handleNestedChange(
                      "billFrom",
                      "businessName",
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Email</label>

                <input
                  value={formData.billFrom.email}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "email", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Phone</label>
                <input
                  value={formData.billFrom.phone}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "phone", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Address</label>
                <textarea
                  value={formData.billFrom.address}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "address", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* bill to */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill To
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Name
                </label>
                <input
                  placeholder="Client Name"
                  value={formData.billTo.clientName}
                  onChange={(e) =>
                    handleNestedChange("billTo", "clientName", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Email
                </label>
                <input
                  placeholder="Client Email"
                  value={formData.billTo.email}
                  onChange={(e) =>
                    handleNestedChange("billTo", "email", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Phone
                </label>
                <input
                  placeholder="Phone"
                  value={formData.billTo.phone}
                  onChange={(e) =>
                    handleNestedChange("billTo", "phone", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Address
                </label>
                <textarea
                  placeholder="Address"
                  rows={3}
                  value={formData.billTo.address}
                  onChange={(e) =>
                    handleNestedChange("billTo", "address", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* invoice items */}
        <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Invoice Items
            </h2>

            <button
              type="button"
              onClick={addItem}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F28C38] hover:bg-[#E67E22] text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* mapping items */}
          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3"
              >
                {/* Item Name */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white/10 hover:bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Quantity */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white/10 hover:bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Unit Price */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Unit Price
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white/10 hover:bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Tax */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Tax %
                  </label>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) =>
                      handleItemChange(index, "taxPercent", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300 bg-white/10 hover:bg-gray-100 text-gray-700"
                  />
                </div>

                {/* Delete */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Action
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full h-12.5 bg-red-500 rounded-xl text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* notes and summay */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-4">
              Notes & Terms
            </h2>

            <textarea
              rows={8}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 text-slate-900 border border-slate-300"
            />
          </div>

          {/* summary */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Invoice Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-slate-900">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-900">
                <span>Tax</span>
                <span>₹{taxTotal.toFixed(2)}</span>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold text-[#12D6C3]">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
// ------------------------------------------------------

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building2,
  CreditCard,
  Trash2,
  Edit,
  Mail,
  Loader2
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";

import {
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  clearCurrentInvoice,
} from "../../features/invoiceSlice";

import ReminderModal from "../../components/ai/ReminderModal";

const InvoiceDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const { currentInvoice, loading, deleteLoading, updateLoading, error } =
    useSelector((state) => state.invoice);

  useEffect(() => {
    dispatch(getInvoiceById(id));

    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

  const handleDeleteInvoice = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteInvoice(id)).unwrap();

      toast.success("Invoice deleted successfully");

      navigate("/invoices");
    } catch (error) {
      toast.error(error);
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = currentInvoice.status === "Paid" ? "Unpaid" : "Paid";

      await dispatch(
        updateInvoice({
          id,
          invoiceData: {
            ...currentInvoice,
            status: newStatus,
          },
        }),
      ).unwrap();

      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#12D6C3]" size={40}/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#55636A] flex justify-center items-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  if (!currentInvoice) {
    return (
      <div className="min-h-screen bg-[#55636A] flex justify-center items-center">
        <div className="text-white text-xl">Invoice not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => navigate("/invoices")}
              className="flex items-center gap-2 text-[#12D6C3] mb-3 cursor-pointer"
            >
              <ArrowLeft size={25} />
              Back to Invoices
            </button>

            <h1 className="text-4xl font-bold text-slate-900">
              {currentInvoice.invoiceNumber}
            </h1>

            <p className="text-gray-600 mt-2">Invoice Details</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(`/invoices/edit/${currentInvoice._id}`)}
              className="bg-[#12D6C3] text-white px-5 py-3 h-15 cursor-pointer text-lg rounded-xl flex items-center gap-2 hover:opacity-90"
            >
              <Edit size={18} />
              Edit
            </button>

            <button
              onClick={() => setIsReminderOpen(true)}
              className="bg-[#F28C38] text-white px-5 py-3 h-15 cursor-pointer text-lg rounded-xl flex items-center gap-2 hover:opacity-90"
            >
              <Mail size={18} />
              AI Reminder
            </button>

            <button
              onClick={handleDeleteInvoice}
              disabled={deleteLoading}
              className="bg-red-500 text-white px-5 py-3 h-15 cursor-pointer text-lg rounded-xl flex items-center gap-2 hover:opacity-90"
            >
              <Trash2 size={18} />
              Delete
            </button>
          </div>
        </div>

        {/* Status */}

        <div className="mb-6">
          <span
            className={`px-4 py-2 rounded-full font-semibold ${
              currentInvoice.status === "Paid"
                ? "bg-green-500 text-white"
                : "bg-yellow-500 text-black"
            }`}
          >
            {currentInvoice.status}
          </span>

          <button
            onClick={handleStatusToggle}
            disabled={updateLoading}
            className="ml-4 bg-white px-4 py-2 rounded-lg cursor-pointer border border-gray-400"
          >
            Mark as {currentInvoice.status === "Paid" ? "Unpaid" : "Paid"}
          </button>
        </div>

        {/* Info Grid */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Bill From */}

          <div className="bg-white rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#12D6C3] mb-4 flex items-center gap-2">
              <Building2 size={20} />
              Bill From
            </h2>

            <div className="space-y-2">
              <p>{currentInvoice.billFrom?.businessName}</p>
              <p>{currentInvoice.billFrom?.email}</p>
              <p>{currentInvoice.billFrom?.phone}</p>
              <p>{currentInvoice.billFrom?.address}</p>
            </div>
          </div>

          {/* Bill To */}

          <div className="bg-white rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#F28C38] mb-4 flex items-center gap-2">
              <User size={20} />
              Bill To
            </h2>

            <div className="space-y-2">
              <p>{currentInvoice.billTo?.clientName}</p>
              <p>{currentInvoice.billTo?.email}</p>
              <p>{currentInvoice.billTo?.phone}</p>
              <p>{currentInvoice.billTo?.address}</p>
            </div>
          </div>
        </div>

        {/* Invoice Info */}

        <div className="bg-white rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-[#12D6C3] mb-4">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-500">Invoice Date</p>
              <p>{new Date(currentInvoice.invoiceDate).toLocaleDateString()}</p>
            </div>

            <div>
              <p className="text-gray-500">Due Date</p>
              <p>
                {currentInvoice.dueDate
                  ? new Date(currentInvoice.dueDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">Payment Terms</p>
              <p>{currentInvoice.paymentTerms}</p>
            </div>
          </div>
        </div>

        {/* Items */}

        <div className="bg-white rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-[#12D6C3] mb-6">
            Invoice Items
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Item</th>
                  <th className="text-left py-3">Qty</th>
                  <th className="text-left py-3">Price</th>
                  <th className="text-left py-3">Tax %</th>
                  <th className="text-left py-3">Amount</th>
                </tr>
              </thead>

              <tbody>
                {currentInvoice.items.map((item, index) => {
                  const amount = item.quantity * item.unitPrice;

                  return (
                    <tr key={index} className="border-b">
                      <td className="py-3">{item.name}</td>

                      <td>{item.quantity}</td>

                      <td>₹{item.unitPrice}</td>

                      <td>{item.taxPercent}%</td>

                      <td>₹{amount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}

        <div className="bg-white rounded-3xl p-6">
          <h2 className="text-xl font-bold text-[#F28C38] mb-4">Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{currentInvoice.subtotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>₹{currentInvoice.taxTotal?.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold border-t pt-3">
              <span>Total</span>
              <span className="text-[#12D6C3]">
                ₹{currentInvoice.total?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        invoiceId={id}
      />
    </div>
  );
};

export default InvoiceDetails;

// -----------------------------------------------------------------------------------
// create invocie
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";

import {
  createInvoice,
  updateInvoice,
  getInvoiceById,
  clearCurrentInvoice,
} from "../../features/invoiceSlice";

// create invoice
const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const aiData = location.state?.aiData;

  // console.log("aiData", aiData)

  const params = useParams();
  const id = params.id;
  const isEditMode = Boolean(id);

  console.log("invoice id", id);
  console.log("isEditMode", isEditMode);

  const { user } = useSelector((state) => state.auth);
  console.log("user", user);
  const { currentInvoice, loading, createLoading, updateLoading } = useSelector(
    (state) => state.invoice,
  );

  // form data use state
  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 15",
    status: "Unpaid",
    currency: "INR",
    discountTotal: 0,
    shippingCharge: 0,

    billFrom: {
      businessName: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
    },

    billTo: {
      clientName: "",
      email: "",
      phone: "",
      address: "",
      gstNumber: "",
    },

    shippingAddress: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },

    orderDetails: {
      salesNumber: "",
      awbNumber: "",
      saleDate: "",
    },

    paymentInfo: {
      method: "",
      transactionId: "",
      paidAt: "",
      amountPaid: 0,
    },

    items: [
      {
        productCode: "",
        name: "",
        description: "",
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
      },
    ],

    notes: "",
  });

  // same as bill to
  const [sameAsBillTo, setSameAsBillTo] = useState(false);

  // data coming from ai
  useEffect(() => {
    if (!aiData) return;

    setFormData((prev) => ({
      ...prev,
      billTo: {
        ...prev.billTo,
        clientName: aiData.clientName || "",
        email: aiData.email || "",
        address: aiData.address || "",
      },
      items:
        aiData.items?.map((item) => ({
          productCode: "",
          name: item.name || "",
          description: "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          taxPercent: 0,
        })) || prev.items,
    }));
  }, [aiData]);

  // auto bill form
  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      billFrom: {
        ...prev.billFrom,
        businessName: user.businessName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      },
    }));
  }, [user]);

  // edit
  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }

    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

  // populate form
  useEffect(() => {
    if (!currentInvoice || !isEditMode) return;

    setFormData({
      invoiceDate: currentInvoice.invoiceDate?.split("T")[0] || "",

      dueDate: currentInvoice.dueDate?.split("T")[0] || "",

      paymentTerms: currentInvoice.paymentTerms || "Net 15",

      status: currentInvoice.status || "Unpaid",

      currency: currentInvoice.currency || "INR",

      discountTotal: currentInvoice.discountTotal || 0,

      shippingCharge: currentInvoice.shippingCharge || 0,

      billFrom: currentInvoice.billFrom || {},

      billTo: currentInvoice.billTo || {},

      shippingAddress: currentInvoice.shippingAddress || {
        name: "",
        email: "",
        phone: "",
        address: "",
      },

      orderDetails: currentInvoice.orderDetails || {
        salesNumber: "",
        awbNumber: "",
        saleDate: "",
      },

      paymentInfo: currentInvoice.paymentInfo || {
        method: "",
        transactionId: "",
        paidAt: "",
        amountPaid: 0,
      },

      items: currentInvoice.items || [],

      notes: currentInvoice.notes || "",
    });
  }, [currentInvoice, isEditMode]);

  // same as bill to useEffect hook
  useEffect(() => {
    if (sameAsBillTo) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          name: prev.billTo.clientName,
          email: prev.billTo.email,
          phone: prev.billTo.phone,
          address: prev.billTo.address,
        },
      }));
    }
  }, [
    sameAsBillTo,
    formData.billTo.clientName,
    formData.billTo.email,
    formData.billTo.phone,
    formData.billTo.address,
  ]);

  // handle change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handle nested change
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // if checkbox is false then shiping addresss become black
  const handleSameAsBillTo = (checked) => {
    setSameAsBillTo(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          name: prev.billTo.clientName,
          email: prev.billTo.email,
          phone: prev.billTo.phone,
          address: prev.billTo.address,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          name: "",
          email: "",
          phone: "",
          address: "",
        },
      }));
    }
  };

  // handle item change
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];

    updatedItems[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // add item
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productCode: "",
          name: "",
          description: "",
          quantity: 1,
          unitPrice: 0,
          taxPercent: 0,
        },
      ],
    }));
  };

  // delete item
  const removeItem = (index) => {
    if (formData.items.length === 1) return;

    const updatedItems = formData.items.filter(
      (_, itemIndex) => itemIndex !== index,
    );

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // total
  const { subtotal, taxTotal, total } = useMemo(() => {
    let subtotal = 0;
    let taxTotal = 0;

    formData.items.forEach((item) => {
      const itemTotal =
        Number(item.quantity || 0) * Number(item.unitPrice || 0);

      subtotal += itemTotal;

      taxTotal += itemTotal * (Number(item.taxPercent || 0) / 100);
    });

    return {
      subtotal,
      taxTotal,

      total:
        subtotal +
        taxTotal +
        Number(formData.shippingCharge || 0) -
        Number(formData.discountTotal || 0),
    };
  }, [formData.items, formData.shippingCharge, formData.discountTotal]);

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.billTo.clientName.trim()) {
      return toast.error("Client name is required");
    }

    if (!formData.billTo.email.trim()) {
      return toast.error("Client email is required");
    }

    if (formData.items.length === 0) {
      return toast.error("Add at least one item");
    }

    if (formData.items.some((item) => !item.name.trim())) {
      return toast.error("Item name is required");
    }

    if (formData.items.some((item) => Number(item.quantity) <= 0)) {
      return toast.error("Quantity must be greater than 0");
    }

    try {
      const payload = {
        ...formData,
        subtotal,
        taxTotal,
        total,
      };

      if (isEditMode) {
        await dispatch(
          updateInvoice({
            id,
            invoiceData: payload,
          }),
        ).unwrap();

        toast.success("Invoice updated successfully");
      } else {
        await dispatch(createInvoice(payload)).unwrap();

        toast.success("Invoice created successfully");
      }

      navigate("/invoices");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 className="animate-spin text-[#12D6C3]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto space-y-6">
        {/* headers */}
        <div className="flex flex-col md:flex-row justify-between items-center  gap-4">
          <div>
            <h1 className="text-3xl font-bold  text-gray-600">
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h1>

            <p className=" text-gray-600">
              Create and manage professional invoices
            </p>
          </div>

          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className="px-6 py-3 rounded-xl bg-[#12D6C3] cursor-pointer text-white  font-semibold flex items-center gap-2 hover:opacity-90"
          >
            {(createLoading || updateLoading) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}

            <Save className="w-4 h-4" />

            {isEditMode ? "Update Invoice" : "Save Invoice"}
          </button>
        </div>

        {/* invoice card info */}
        <div className="backdrop-blur-xl border border-slate-300 rounded-3xl p-6 bg-white">
          <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
            Invoice Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-slate-300">
            {/* invoice */}
            <div>
              <label className="block  text-gray-900 mb-2">Invoice Date</label>

              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              />
            </div>

            {/* due date */}
            <div>
              <label className="block  text-gray-900  mb-2">Due Date</label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              />
            </div>

            {/* payments terms */}
            <div>
              <label className="block  text-gray-900  mb-2">
                Payment Terms
              </label>

              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
              >
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Due on Receipt</option>
              </select>
            </div>
            {/* Status */}
            <div>
              <label className="block text-gray-900 mb-2">Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              >
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-gray-900 mb-2">Currency</label>

              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              >
                <option value="INR">INR ₹</option>
                <option value="USD">USD $</option>
                <option value="EUR">EUR €</option>
                <option value="GBP">GBP £</option>
              </select>
            </div>
          </div>
        </div>

        {/* bill form and bill to */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* bill form */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill From
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block  text-gray-900  mb-2">
                  Business Name
                </label>
                <input
                  value={formData.billFrom.businessName}
                  onChange={(e) =>
                    handleNestedChange(
                      "billFrom",
                      "businessName",
                      e.target.value,
                    )
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Email</label>

                <input
                  value={formData.billFrom.email}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "email", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Phone</label>
                <input
                  value={formData.billFrom.phone}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "phone", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">Address</label>
                <textarea
                  value={formData.billFrom.address}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "address", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>
              {/* gst number */}
              <div>
                <label className="block text-gray-900 mb-2">GST Number</label>

                <input
                  value={formData.billFrom.gstNumber}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "gstNumber", e.target.value)
                  }
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
                />
              </div>
            </div>
          </div>

          {/* bill to */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill To
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Name
                </label>
                <input
                  placeholder="Client Name"
                  value={formData.billTo.clientName}
                  onChange={(e) =>
                    handleNestedChange("billTo", "clientName", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Email
                </label>
                <input
                  placeholder="Client Email"
                  value={formData.billTo.email}
                  onChange={(e) =>
                    handleNestedChange("billTo", "email", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Phone
                </label>
                <input
                  placeholder="Phone"
                  value={formData.billTo.phone}
                  onChange={(e) =>
                    handleNestedChange("billTo", "phone", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>

              <div>
                <label className="block  text-gray-900  mb-2">
                  Client Address
                </label>
                <textarea
                  placeholder="Address"
                  rows={3}
                  value={formData.billTo.address}
                  onChange={(e) =>
                    handleNestedChange("billTo", "address", e.target.value)
                  }
                  className="w-full rounded-xl p-3 bg-white/10 border border-slate-300  text-gray-600 hover:bg-gray-100"
                />
              </div>
              {/* gst number */}
              <div>
                <label className="block text-gray-900 mb-2">GST Number</label>

                <input
                  value={formData.billTo.gstNumber}
                  onChange={(e) =>
                    handleNestedChange("billTo", "gstNumber", e.target.value)
                  }
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          {/* same as bill to logic */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Shipping Address
            </h2>

            <label className="flex items-center gap-2 cursor-pointer textmb text-gray-700">
              <input
                type="checkbox"
                checked={sameAsBillTo}
                onChange={(e) => handleSameAsBillTo(e.target.checked)}
              />
              Same as Bill To
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-900 mb-2">Recipient Name</label>

              <input
                type="text"
                value={formData.shippingAddress.name}
                onChange={(e) =>
                  handleNestedChange("shippingAddress", "name", e.target.value)
                }
                placeholder="Enter recipient name"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Email</label>

              <input
                type="email"
                value={formData.shippingAddress.email}
                onChange={(e) =>
                  handleNestedChange("shippingAddress", "email", e.target.value)
                }
                placeholder="Enter email"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Phone</label>

              <input
                type="text"
                value={formData.shippingAddress.phone}
                onChange={(e) =>
                  handleNestedChange("shippingAddress", "phone", e.target.value)
                }
                placeholder="Enter phone number"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-900 mb-2">
                Shipping Address
              </label>

              <textarea
                rows={4}
                value={formData.shippingAddress.address}
                onChange={(e) =>
                  handleNestedChange(
                    "shippingAddress",
                    "address",
                    e.target.value,
                  )
                }
                placeholder="Enter shipping address"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
            Order Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-900 mb-2">Sales Number</label>

              <input
                type="text"
                value={formData.orderDetails.salesNumber}
                onChange={(e) =>
                  handleNestedChange(
                    "orderDetails",
                    "salesNumber",
                    e.target.value,
                  )
                }
                placeholder="ORD-12345"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">AWB Number</label>

              <input
                type="text"
                value={formData.orderDetails.awbNumber}
                onChange={(e) =>
                  handleNestedChange(
                    "orderDetails",
                    "awbNumber",
                    e.target.value,
                  )
                }
                placeholder="Enter AWB Number"
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Sale Date</label>

              <input
                type="date"
                value={formData.orderDetails.saleDate}
                onChange={(e) =>
                  handleNestedChange("orderDetails", "saleDate", e.target.value)
                }
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* invoice items */}
        <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Invoice Items
            </h2>

            <button
              type="button"
              onClick={addItem}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#F28C38] hover:bg-[#E67E22] text-white flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* mapping items */}
          <div className="space-y-6">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-16 gap-3"
              >
                {/* Item Name */}
                <div className="sm:col-span-4 lg:col-span-8">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* decsription */}
                <div className="sm:col-span-2 lg:col-span-8">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Product Description
                  </label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* product code */}
                <div className="sm:col-span-2 lg:col-span-4">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Product Code
                  </label>
                  <input
                    type="text"
                    placeholder="Product code"
                    value={item.productCode}
                    onChange={(e) =>
                      handleItemChange(index, "productCode", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Quantity */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Unit Price */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    MRP Price
                  </label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      handleItemChange(index, "unitPrice", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Discount */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Discount
                  </label>

                  <input
                    type="number"
                    name="discountTotal"
                    value={formData.discountTotal}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Shipping Charge */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Shipping Charge
                  </label>

                  <input
                    type="number"
                    name="shippingCharge"
                    value={formData.shippingCharge}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Tax */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Tax %
                  </label>
                  <input
                    type="number"
                    value={item.taxPercent}
                    onChange={(e) =>
                      handleItemChange(index, "taxPercent", e.target.value)
                    }
                    className="w-full p-3 rounded-xl border border-slate-300"
                  />
                </div>

                {/* Delete */}
                <div className="sm:col-span-1 lg:col-span-2">
                  <label className="block text-sm font-medium text-slate-900 mb-1">
                    Action
                  </label>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full h-12.5 bg-red-500 rounded-xl text-white flex items-center justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* notes and summay */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-4">
              Notes & Terms
            </h2>

            <textarea
              rows={8}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/10 text-slate-900 border border-slate-300"
            />
          </div>

          {/* summary */}
          <div className="bg-white backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Invoice Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{taxTotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{Number(formData.shippingCharge).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Discount</span>
                <span>- ₹{Number(formData.discountTotal).toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-2xl font-bold text-[#12D6C3]">
                <span>Grand Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;


/***
 * qunatity = 2
 * mrpPrice = 100
 * total mrpPrice = 200
 * discountedPrice = 70
 * total DiscountedPrice = 140
 * discountPercentage = 0%
 * gst inclusive on total discountedPrice = 118.64
 * tax toal(gst) = 21.36
 * shipingCharge = 10
 * 
 * 
 * 
 * Invoice Summary
   Subtotal (Excl. Tax) - 118.64
   Tax Total - 21.36
   Shipping Charges - 10
   Total Savings (Discount) - 60
   Grand Total - 150

   if
   qunatity = 2
 * mrpPrice = 100
 * total mrpPrice = 200
 * discountedPrice = 100
 * total DiscountedPrice = 200
 * discountPercentage = 10%
 * gst inclusive on total discountedPrice = 169.49
 * tax toal(gst) = 30.51
 * shipingCharge = 1
 * 
 * 
 * 
 * Invoice Summary
   Subtotal (Excl. Tax) - 169.49
   Tax Total - 30.51
   Shipping Charges - 0
   Total Savings (Discount) - 20
   Grand Total - 200

   if
   qunatity = 2
 * mrpPrice = 100
 * total mrpPrice = 200
 * discountedPrice = 80
 * total DiscountedPrice = 160
 * discount = 10%
 * gst inclusive on total discountedPrice = 169.49
 * tax toal(gst) = 30.51
 * shipingCharge = 1
 * 
 * 
 * 
 * Invoice Summary
   Subtotal (Excl. Tax) - 169.49
   Tax Total - 30.51
   Shipping Charges - 0
   Total Savings (Discount) - 56
   Grand Total - 184

 * 
 * 
 * 
 * 
 * 
 */