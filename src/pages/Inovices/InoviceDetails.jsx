import React, { useEffect, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  getInvoiceById,
  deleteInvoice,
  updateInvoice,
  clearCurrentInvoice,
} from "../../features/invoiceSlice";
import ReminderModal from "../../components/ai/ReminderModal";

// invoice details
const InvoiceDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const { currentInvoice, loading, deleteLoading, updateLoading, error } =
    useSelector((state) => state.invoice);

  //  openingReminderModal
  const openingReminderModal = (invoiceId) => {
    console.log("hello");
    setSelectedInvoiceId(invoiceId);
    setIsReminderOpen(true);
  };

  // useeffect
  useEffect(() => {
    dispatch(getInvoiceById(id));

    return () => {
      dispatch(clearCurrentInvoice());
    };
  }, [dispatch, id]);

  // download pdf
  const downloadPDF = async () => {
    const input = invoiceRef.current;
    console.log("hello");
    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",

        scrollY: -window.scrollY,

        ignoreElements: (el) => {
          return el?.classList?.contains("no-pdf");
        },

        onclone: (doc) => {
          doc.querySelectorAll("*").forEach((el) => {
            el.style.color = "#000";
            el.style.boxShadow = "none";
          });
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let remainingHeight = imgHeight;

      while (remainingHeight > 0) {
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

        remainingHeight -= pageHeight;

        if (remainingHeight > 0) {
          pdf.addPage();
          position -= pageHeight;
        }
      }
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error(error);
      toast.error("PDF generation failed");
    }
  };

  // handle delte invocie
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

  // handle status toggle
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

  // loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-[#12D6C3]" size={40} />
        </div>
      </div>
    );
  }

  // error
  if (error) {
    return (
      <div className="min-h-screen bg-[#55636A] flex justify-center items-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  // if not invocie
  if (!currentInvoice) {
    return (
      <div className="min-h-screen bg-[#55636A] flex justify-center items-center">
        <div className="text-white text-xl">Invoice not found</div>
      </div>
    );
  }

  const invoice = currentInvoice;
  console.log("invocie", invoice.items);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* actions */}
      <div className="max-w-5xl mx-auto flex justify-between mb-4 print:hidden">
        <button
          onClick={() => navigate("/invoices")}
          className="flex items-center gap-2 text-slate-700 mb-3 cursor-pointer hover:text-slate-900 transition-colors duration-200"
        >
          <ArrowLeft size={25} />
          Back to Invoices
        </button>

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
            className="ml-4 bg-white px-4 py-2 rounded-lg cursor-pointer border border-gray-400 transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80"
          >
            Mark as {currentInvoice.status === "Paid" ? "Unpaid" : "Paid"}
          </button>
        </div>

        <button
          onClick={() => navigate(`/invoices/edit/${currentInvoice._id}`)}
          className="bg-[#12D6C3] text-white px-5 py-3 h-10 cursor-pointer text-lg rounded-xl flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80"
        >
          <Edit size={18} />
          Edit
        </button>

        <button
          onClick={() => openingReminderModal(currentInvoice._id)}
          className="bg-[#F28C38] text-white px-5 py-3 h-10 cursor-pointer text-lg rounded-xl flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80"
        >
          <Mail size={18} />
          AI Reminder
        </button>

        <button
          onClick={handleDeleteInvoice}
          disabled={deleteLoading}
          className="bg-red-500 text-white px-5 py-3 h-10 cursor-pointer text-lg rounded-xl flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80"
        >
          <Trash2 size={18} />
          Delete
        </button>

        <button
          onClick={downloadPDF}
          className="bg-blue-900 text-white px-5 py-3 h-10 cursor-pointer text-lg rounded-xl flex items-center gap-2 transition-all duration-200 hover:opacity-90 hover:scale-105 hover:shadow-lg active:scale-95 active:opacity-80"
        >
          Download PDF
        </button>
      </div>

      {/* invoce content  */}
      <div
        ref={invoiceRef}
        className="pdf-area max-w-5xl mx-auto bg-white p-10 rounded-xl shadow print:shadow-none"
      >
        {/* header */}
        <div className="flex justify-between border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p>#{invoice.invoiceNumber}</p>
          </div>

          <div className="text-right">
            <p>Status</p>
            <span className="font-bold">{invoice.status}</span>
          </div>
        </div>

        {/* second colom of pdf */}
        <div className="grid grid-cols-3.5 mt-6 text-sm">
          <p>
            <b>Date:</b> {new Date(invoice.invoiceDate).toLocaleDateString()}
          </p>

          <p>
            <b>Due:</b>{" "}
            {invoice.dueDate
              ? new Date(invoice.dueDate).toLocaleDateString()
              : "-"}
          </p>

          <p>
            <b>Currency:</b> {invoice.currency}
          </p>
        </div>

        {/* billing */}
        <div className="flex justify-between mt-8">
          <div>
            <h3 className="font-bold mb-2">Bill From</h3>
            <p>{invoice.billFrom?.businessName}</p>
            <p>{invoice.billFrom?.email}</p>
            <p>{invoice.billFrom?.phone}</p>
            <p>{invoice.billFrom?.address}</p>
            <p>GST: {invoice.billFrom?.gstNumber}</p>
          </div>

          <div className="text-left">
            <h3 className="font-bold mb-2">Bill To</h3>
            <p>{invoice.billTo?.clientName}</p>
            <p>{invoice.billTo?.email}</p>
            <p>{invoice.billTo?.phone}</p>
            <p>{invoice.billTo?.address}</p>
            <p>GST: {invoice.billTo?.gstNumber}</p>
          </div>
        </div>

        {/* shiping */}
        <div className="mt-6 border-t pt-4">
          <h3 className="font-bold">Shipping Address</h3>
          <p>{invoice.shippingAddress?.name}</p>
          <p>{invoice.shippingAddress?.email}</p>
          <p>{invoice.shippingAddress?.phone}</p>
          <p>{invoice.shippingAddress?.address}</p>
        </div>

        {/* order details */}
        <div className="mt-6 flex justify-around text-sm">
          <p>Sales #: {invoice.orderDetails?.salesNumber}</p>
          <p>AWB #: {invoice.orderDetails?.awbNumber}</p>
          <p>
            Sale Date:{" "}
            {invoice.orderDetails?.saleDate
              ? new Date(invoice.orderDetails.saleDate).toLocaleDateString()
              : "-"}
          </p>
        </div>

        {/* items */}
        <div className="mt-8">
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th>Product</th>
                <th>Code</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Tax%</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items?.map((item, i) => (
                <tr key={i} className="text-center border-b">
                  <td>{item.name}</td>
                  <td>{item.productCode}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.mrpPrice}</td>
                  <td>{invoice.taxRate}%</td>
                  <td>₹{item.discountedPrice?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* payment info */}
        {/* <div className="mt-6 text-sm">
          <h3 className="font-bold">Payment Info</h3>
          <p>Method: {invoice.paymentInfo?.method}</p>
          <p>Txn ID: {invoice.paymentInfo?.transactionId}</p>
          <p>
            Paid At:{" "}
            {invoice.paymentInfo?.paidAt
              ? new Date(invoice.paymentInfo.paidAt).toLocaleDateString()
              : "-"}
          </p>
          <p>Amount Paid: ₹{invoice.paymentInfo?.amountPaid}</p>
        </div> */}

        {/* total */}
        <div className="mt-8 ml-auto w-80 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{invoice.subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹{invoice.taxTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{invoice.shippingCharge?.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>-₹{invoice.discountTotal}</span>
          </div>

          <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-[#12D6C3]">
              ₹{invoice.grandTotal?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        invoiceId={selectedInvoiceId}
      />
    </div>
  );
};

export default InvoiceDetails;
