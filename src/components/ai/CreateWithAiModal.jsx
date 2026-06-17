import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { useDispatch } from "react-redux";
import { parseInvoiceText } from "../../features/aiSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateWithAiModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [text, setText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast.error("Please enter invoice text");
      return;
    }

    try {
      setIsLoading(true);

      const result = await dispatch(
        parseInvoiceText(text)
      ).unwrap();

      toast.success("Invoice generated successfully");

      onClose();

      navigate("/invoices/new", {
        state: {
          aiData: result,
        },
      });

    } catch (error) {
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">

      <div className="bg-white p-6 rounded-3xl w-full max-w-2xl">

        <div className="flex justify-between items-center mb-4">

          <h3 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles size={20} />
            Create Invoice with AI
          </h3>

          <button onClick={onClose} className="cursor-pointer">
            ✕
          </button>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste invoice text..."
          className="w-full border rounded-xl p-4"
        />

        <div className="flex justify-end gap-3 mt-4">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2 bg-[#F28C38] text-white rounded-xl cursor-pointer"
          >
            {isLoading
              ? "Generating..."
              : "Generate Invoice"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CreateWithAiModal;








// import React, { useState } from 'react'
// import { Sparkles } from 'lucide-react'
// import axiosInstance from '../../utils/axiosInstances'
// import { API_PATHS } from '../../utils/apiPaths'
// import toast from "react-router-dom"
// import { useNavigate } from 'react-router-dom'

// const CreateWithAiModal = ({isOpen, onClose}) => {

//   const [text, setText ] = useState("")
//   const [isLoading, setIsLoading ] = useState(false)


// const handleGenerate = async () => {
//   if(!text.trim()){
//  toast.error('Please paste some text to generate an invoice.');
//   return;
//   }

// setIsLoading(true);
// try {
//   const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text });
//   const invoiceData = response.data;

//   toast.success('Invoice data extracted successfully!');
//   onClose();

//   // Navigate to create invoice page with the parsed data
//   navigate('/invoices/new', { state: { aiData: invoiceData } });

// } catch (error) {
//   toast.error('Failed to generate invoice from text.');
//   console.error('AI parsing error:', error);
// } finally {
//   setIsLoading(false);
// }
// };

//   if(!isOpen) return null


//   return (
   
// <div className="">
//   <div className="">
//     <div className="" onClick={onClose}></div>

//     <div className="">
//       <div className="">
//         <h3 className="">
//           <Sparkles className="" />
//           Create Invoice with AI
//         </h3>
//         <button onClick={onClose} className="">&times;</button>
//       </div>

//       <div className=''>
//         <p className=''>
//           Paste any text that contains invoice details ( like client name, items, quantites, and prices ) and the AI will attempt to create an invoice from it
//         </p>
//         <textarea name="invoiceText" label="paste Invoice Text Here" value={text} onChange={(e)=>setText(e.target.text)} placeholder='e.g. Invoice for ClientCorp: 2 hours of design work at $150/hr and 1 logo for $800' rows={8} id=""></textarea>
//         </div>

//         <div className=''>
//           <button onClick={()=>onClose}>Cancel</button>
//           <button onClick={handleGenerate} isLoading={isLoading}>
//             {isLoading ? "Generating..."  : "Generate Invoice"}
//           </button>
//           </div>
//           </div>
//           </div>
//           </div>


//   )
// }

// export default CreateWithAiModal