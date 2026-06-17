import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "../../utils/data";

const FaqItem = ({ faq, isOpen, onClick }) => (
  <div
    className="
      bg-white/5
      backdrop-blur-md
      border
      border-white/10
      rounded-2xl
      overflow-hidden
      transition-all
      duration-300
      hover:border-[#12D6C3]/40
    "
  >
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-6 text-left"
    >
      <span className="text-white font-medium text-lg">
        {faq.question}
      </span>

      <ChevronDown
        className={`w-6 h-6 text-[#12D6C3] transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    {isOpen && (
      <div className="px-6 pb-6 text-gray-300 leading-relaxed">
        {faq.answer}
      </div>
    )}
  </div>
);

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 lg:py-28 bg-[#55636A] relative overflow-hidden"
    >
      {/* Glow Effects */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-[#12D6C3]/10 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F28C38]/10 blur-[150px] rounded-full"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Everything you need to know about our AI-powered invoice platform.
          </p>
        </div>

        <div className="space-y-5">
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;