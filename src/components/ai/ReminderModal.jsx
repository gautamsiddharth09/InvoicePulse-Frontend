import React, { useEffect, useState } from "react";
import { Loader2, Mail, Copy, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { generateReminder } from "../../features/aiSlice";
import { toast } from "react-toastify";

const ReminderModal = ({ isOpen, onClose, invoiceId }) => {
  const dispatch = useDispatch();

  const { reminderText, loading } = useSelector(
    (state) => state.ai
  );

  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (isOpen && invoiceId) {
      dispatch(generateReminder(invoiceId));
    }
  }, [dispatch, isOpen, invoiceId]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(reminderText);

    setHasCopied(true);

    toast.success("Copied to clipboard");

    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-2xl">

        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Mail size={20} />
            AI Reminder Email
          </h3>

          <button onClick={onClose} className="cursor-pointer">
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <textarea
            value={reminderText}
            readOnly
            rows={12}
            className="w-full border rounded-xl p-4"
          />
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="px-4 py-2 bg-[#12D6C3] text-white rounded-xl flex items-center gap-2 cursor-pointer"
          >
            {hasCopied ? <Check size={18} /> : <Copy size={18} />}

            {hasCopied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;


