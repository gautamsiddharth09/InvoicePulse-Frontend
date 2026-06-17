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

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const aiData = location.state?.aiData;

  const params = useParams();
  const id = params.id;
  const isEditMode = Boolean(id);

  const { user } = useSelector((state) => state.auth);
  const { currentInvoice, loading, createLoading, updateLoading } = useSelector(
    (state) => state.invoice,
  );

  // Form Data Initial State
  const [formData, setFormData] = useState({
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "Net 15",
    status: "Unpaid",
    currency: "INR",
    taxRate: 0,
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
        mrpPrice: 0,
        discount: 0,
        shippingCharge: 0,
        discountedPrice: 0,
      },
    ],
    notes: "",
  });

  const [sameAsBillTo, setSameAsBillTo] = useState(false);

  // user text -> gemini call--parseInvoiceFromText()-->ai json return-->navigate on create invocie page-->CreateInvoice.jsx  aiData receive-->useeffect autofill
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
          productCode: item.productCode || "",
          name: item.name || "",
          description: item.description || "",
          quantity: item.quantity || 1,
          mrpPrice: item.mrpPrice || 0,
          discount: item.discount || 0,
          discountedPrice: item.discountedPrice || item.mrpPrice || 0,
        })) || prev.items,
    }));
  }, [aiData]);

  // Autofill Business Details
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
        gstNumber: user.gstNumber || "",
      },
    }));
  }, [user]);

  // handle Edit
  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id));
    }
    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

  // Populate form fields
  useEffect(() => {
    if (!currentInvoice || !isEditMode) return;

    setFormData({
      invoiceDate: currentInvoice.invoiceDate?.split("T")[0] || "",
      dueDate: currentInvoice.dueDate?.split("T")[0] || "",
      paymentTerms: currentInvoice.paymentTerms || "Net 15",
      status: currentInvoice.status || "Unpaid",
      currency: currentInvoice.currency || "INR",
      taxRate: currentInvoice.taxRate || 0,
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

  // Shipping logic
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // hanlde nested change
  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  // hanlde same as bill to
  const handleSameAsBillTo = (checked) => {
    setSameAsBillTo(checked);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: checked
        ? {
            name: prev.billTo.clientName,
            email: prev.billTo.email,
            phone: prev.billTo.phone,
            address: prev.billTo.address,
          }
        : { name: "", email: "", phone: "", address: "" },
    }));
  };

  // hanlde item change
  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };
      return { ...prev, items: updatedItems };
    });
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
          mrpPrice: 0,
          discount: 0,
          discountedPrice: 0,
          shippingCharge: 0,
        },
      ],
    }));
  };

  // remove item
  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  // use memo for memoisation calculation
  const metrics = useMemo(() => {
    let totalInclusive = 0;
    let totalSavings = 0;

    formData.items.forEach((item) => {
      const qty = Number(item.quantity) || 1;
      const mrp = Number(item.mrpPrice) || 0;
      const discPercent = Number(item.discount) || 0;
      const sellingPrice = Number(item.discountedPrice) || 0;

      // Optional discount percentage application
      const finalPricePerItem =
        discPercent > 0
          ? sellingPrice - sellingPrice * (discPercent / 100)
          : sellingPrice;

      totalInclusive += finalPricePerItem * qty;
      totalSavings += (mrp - finalPricePerItem) * qty;
    });

    const taxRate = Number(formData.taxRate) || 0;
    const shipping = Number(formData.shippingCharge) || 0;

    // GST Inclusive Logic
    const subtotal = totalInclusive / (1 + taxRate / 100);
    const taxTotal = totalInclusive - subtotal;
    const grandTotal = totalInclusive + shipping;

    return {
      subtotal: Number(subtotal) || 0,
      taxTotal: Number(taxTotal) || 0,
      discountTotal: Number(totalSavings) || 0,
      grandTotal: Number(grandTotal) || 0,
    };
  }, [formData.items, formData.taxRate, formData.shippingCharge]);

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!formData.billTo.clientName?.trim())
      return toast.error("Client name is required");
    if (!formData.billTo.email?.trim())
      return toast.error("Client email is required");
    if (formData.items.length === 0)
      return toast.error("Add at least one item");
    if (formData.items.some((item) => !item.name || !item.name.trim()))
      return toast.error("Item name is required");
    if (formData.items.some((item) => Number(item.quantity) <= 0))
      return toast.error("Quantity must be greater than 0");

    try {
      const formattedItems = formData.items.map((item) => {
        const qty = Number(item.quantity) || 1;
        const discPercent = Number(item.discount) || 0;
        const sellingPrice = Number(item.discountedPrice) || 0;

        // use memo logic during submit
        const finalPricePerItem =
          discPercent > 0
            ? sellingPrice - sellingPrice * (discPercent / 100)
            : sellingPrice;

        return {
          productCode: item.productCode || "",
          name: item.name ? item.name.trim() : "",
          description: item.description || "",
          quantity: qty,
          mrpPrice: Number(item.mrpPrice) || 0,
          discount: discPercent,
          discountedPrice: Number(finalPricePerItem) || 0, // यह डेटाबेस में सही वैल्यू भेजेगा
        };
      });

      const payload = {
        ...formData,
        items: formattedItems,
        subtotal: isNaN(metrics.subtotal)
          ? 0
          : Number(Number(metrics.subtotal).toFixed(2)),
        taxTotal: isNaN(metrics.taxTotal)
          ? 0
          : Number(Number(metrics.taxTotal).toFixed(2)),
        discountTotal: isNaN(metrics.discountTotal)
          ? 0
          : Number(Number(metrics.discountTotal).toFixed(2)),
        grandTotal: isNaN(metrics.grandTotal)
          ? 0
          : Number(Number(metrics.grandTotal).toFixed(2)),
      };

      if (isEditMode) {
        await dispatch(updateInvoice({ id, invoiceData: payload })).unwrap();
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

  //   useEffect(() => {
  //   console.log("current invoice items");
  //   console.log(currentInvoice?.items);
  // }, [currentInvoice]);

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
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-600">
              {isEditMode ? "Edit Invoice" : "Create Invoice"}
            </h1>
            <p className="text-gray-600">
              Create and manage professional invoices
            </p>
          </div>

          <button
            type="submit"
            disabled={createLoading || updateLoading}
            className="px-6 py-3 rounded-xl bg-[#12D6C3] cursor-pointer text-white font-semibold flex items-center gap-2 hover:opacity-90"
          >
            {(createLoading || updateLoading) && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
            <Save className="w-4 h-4" />
            {isEditMode ? "Update Invoice" : "Save Invoice"}
          </button>
        </div>

        {/* Invoice Information Card */}
        <div className="backdrop-blur-xl border border-slate-300 rounded-3xl p-6 bg-white">
          <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
            Invoice Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-gray-900 mb-2">Invoice Date</label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-900 mb-2">Payment Terms</label>
              <select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
              >
                <option>Net 15</option>
                <option>Net 30</option>
                <option>Net 60</option>
                <option>Due on Receipt</option>
              </select>
            </div>

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

        {/* Bill From / Bill To Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-300 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill From
            </h2>
            <div className="space-y-4">
              {[
                { label: "Business Name", key: "businessName" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    value={formData.billFrom[field.key]}
                    onChange={(e) =>
                      handleNestedChange("billFrom", field.key, e.target.value)
                    }
                    className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-900 mb-2">Address</label>
                <textarea
                  value={formData.billFrom.address}
                  onChange={(e) =>
                    handleNestedChange("billFrom", "address", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
                />
              </div>
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

          <div className="bg-white border border-slate-300 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Bill To
            </h2>
            <div className="space-y-4">
              {[
                { label: "Client Name", key: "clientName" },
                { label: "Client Email", key: "email" },
                { label: "Client Phone", key: "phone" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-gray-900 mb-2">
                    {field.label}
                  </label>
                  <input
                    value={formData.billTo[field.key]}
                    onChange={(e) =>
                      handleNestedChange("billTo", field.key, e.target.value)
                    }
                    className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-900 mb-2">
                  Client Address
                </label>
                <textarea
                  value={formData.billTo.address}
                  onChange={(e) =>
                    handleNestedChange("billTo", "address", e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-600 hover:bg-gray-100"
                />
              </div>
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
        <div className="bg-white border border-slate-300 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Shipping Address
            </h2>
            <label className="flex items-center gap-2 cursor-pointer text-gray-700">
              <input
                type="checkbox"
                checked={sameAsBillTo}
                onChange={(e) => handleSameAsBillTo(e.target.checked)}
              />
              Same as Bill To
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-gray-900 mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData.shippingAddress[field]}
                  onChange={(e) =>
                    handleNestedChange("shippingAddress", field, e.target.value)
                  }
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
                />
              </div>
            ))}
            <div className="md:col-span-3">
              <label className="block text-gray-900 mb-2">
                Shipping Address
              </label>
              <textarea
                rows={3}
                value={formData.shippingAddress.address}
                onChange={(e) =>
                  handleNestedChange(
                    "shippingAddress",
                    "address",
                    e.target.value,
                  )
                }
                className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6">
          <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
            Order Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["salesNumber", "awbNumber"].map((field) => (
              <div key={field}>
                <label className="block text-gray-900 mb-2">
                  {field === "salesNumber" ? "Sales Number" : "AWB Number"}
                </label>
                <input
                  type="text"
                  value={formData.orderDetails[field]}
                  onChange={(e) =>
                    handleNestedChange("orderDetails", field, e.target.value)
                  }
                  className="w-full rounded-xl p-3 border border-slate-300 text-gray-700 hover:bg-gray-100"
                />
              </div>
            ))}
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

        {/* Invoice Items  */}
        <div className="bg-white border border-slate-300 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Invoice Items
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 rounded-xl bg-[#F28C38] hover:bg-[#E67E22] text-white flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-13 gap-3 pb-4 border-b border-gray-100"
              >
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600">
                    Product Name
                  </label>
                  <input
                    type="text"
                    placeholder="Product name"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="text-xs font-semibold text-gray-600">
                    Product Description
                  </label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(index, "description", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-gray-600">
                    Product Code
                  </label>
                  <input
                    type="text"
                    placeholder="Product code"
                    value={item.productCode}
                    onChange={(e) =>
                      handleItemChange(index, "productCode", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Qunatity
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-600">
                    MRP Price
                  </label>
                  <input
                    type="number"
                    value={item.mrpPrice}
                    onChange={(e) =>
                      handleItemChange(index, "mrpPrice", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Disc Price
                  </label>
                  <input
                    type="number"
                    value={item.discountedPrice}
                    onChange={(e) =>
                      handleItemChange(index, "discountedPrice", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="text-xs font-semibold text-gray-600">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChange(index, "discount", e.target.value)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="w-full p-2.5 bg-red-500 rounded-xl text-white flex justify-center hover:bg-red-600 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Tax  */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-300 rounded-3xl p-6 space-y-4">
            <h2 className="text-xl font-semibold text-[#12D6C3]">
              Global Modifiers
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Shipping Charges (₹)
                </label>
                <input
                  type="number"
                  name="shippingCharge"
                  value={formData.shippingCharge}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes & Terms
              </label>
              <textarea
                rows={4}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          <div className="bg-white border border-slate-300 rounded-3xl p-6">
            <h2 className="text-xl font-semibold text-[#12D6C3] mb-6">
              Invoice Summary
            </h2>
            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between">
                <span>Subtotal (Excl. Tax)</span>
                <span>₹{metrics.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Total</span>
                <span>₹{metrics.taxTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Charges</span>
                <span>₹{Number(formData.shippingCharge).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Total Savings (Discount)</span>
                <span>- ₹{metrics.discountTotal.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between text-xl font-bold text-gray-900">
                <span>Grand Total</span>
                <span>₹{metrics.grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
