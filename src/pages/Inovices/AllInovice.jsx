import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Sparkles,
  Trash2,
  Mail,
  FileText,
  Loader2,
  Edit,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getAllInvoices, deleteInvoice } from "../../features/invoiceSlice";

import ReminderModal from "../../components/ai/ReminderModal";
import CreateWithAiModal from "../../components/ai/CreateWithAiModal";

const AllInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { invoices, loading, deleteLoading } = useSelector(
    (state) => state.invoice,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  const [isReminderOpen, setIsReminderOpen] = useState(false);

  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllInvoices());
  }, [dispatch]);

  const handleDeleteInvoice = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?",
    );

    if (!confirmed) return;

    try {
      await dispatch(deleteInvoice(id)).unwrap();

      toast.success("Invoice deleted successfully");
    } catch (error) {
      toast.error(error);
    }
  };

  const openReminderModal = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setIsReminderOpen(true);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.invoiceNumber
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.billTo?.clientName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : invoice.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] p-6">
      <div className="max-w-7xl mx-auto">
        {/* header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">All Invoices</h1>
            <p className="text-slate-500 mt-1">
              Manage all your invoices in one place
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="bg-[#F28C38] hover:opacity-90 transition text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Sparkles size={18} />
              Create with AI
            </button>

            <button
              onClick={() => navigate("/invoices/new")}
              className="bg-[#12D6C3] hover:opacity-90 transition text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Plus size={18} />
              Create Invoice
            </button>
          </div>
        </div>

        {/* search section */}
        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            {/* search */}
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search invoice # or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-slate-500"
              />
            </div>

            {/* filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-slate-500"
            >
              <option value="All">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* loading */}
        {loading && (
          <div className="flex justify-center items-center h-96">
            <Loader2
              className="w-8 h-8 animate-spin text-[#12D6C3]"
              size={40}
            />
          </div>
        )}

        {/* search */}
        {!loading && filteredInvoices.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
            <FileText size={60} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Invoices Found</h2>
            <p className="text-gray-500">
              Create your first invoice to get started.
            </p>
          </div>
        )}

        {/* table section */}
        {!loading && filteredInvoices.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                {/* table head */}
                <thead className="bg-gray-50 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Client</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                {/* table  body*/}
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      {/* invoice no */}
                      <td className="p-4 font-medium text-slate-900">
                        {invoice.invoiceNumber}
                      </td>

                      {/* CLIENT */}
                      <td className="p-4 text-slate-600">
                        {invoice.billTo?.clientName}
                      </td>

                      {/* amount */}
                      <td className="p-4 font-medium">
                        ₹{invoice.grandTotal?.toLocaleString()}
                      </td>

                      {/* DUE DATE */}
                      <td className="p-4 text-slate-600">
                        {invoice.dueDate
                          ? new Date(invoice.dueDate).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Sstatus */}
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            invoice.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      {/* action buttons */}
                      <td className="p-4">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => navigate(`/invoices/${invoice._id}`)}
                            className="px-3 py-2 bg-[#12D6C3] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Edit size={14} />
                            View
                          </button>

                          <button
                            onClick={() => openReminderModal(invoice._id)}
                            className="px-3 py-2 bg-[#F28C38] text-white rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Mail size={14} />
                            Reminder
                          </button>

                          <button
                            onClick={() => handleDeleteInvoice(invoice._id)}
                            disabled={deleteLoading}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* modal */}
      <ReminderModal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        invoiceId={selectedInvoiceId}
      />

      <CreateWithAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};

export default AllInvoice;
