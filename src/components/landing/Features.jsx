import React from "react";
import { FEATURES } from "../../utils/data";
import { Sparkles, BarChart2, Mail, FileText, ArrowRight } from "lucide-react";

const Features = () => {
  return (
    <section
      id="features"
      className="relative py-20 lg:py-28 bg-[#55636A] overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-112.5 h-112.5 bg-[#12D6C3]/10 blur-[140px] rounded-full"></div>

        <div className="absolute bottom-15 right-10 w-87.5 h-87.5 bg-[#F28C38]/10 blur-[150px] rounded-full"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Powerful Features to Run Your Business
          </h2>

          <p className="mt-4 text-base sm:text-lg text-gray-200 max-w-2xl mx-auto">
            Everything you need to manage your invoicing and get paid faster
            with AI automation.
          </p>

          {/* small accent line */}
          <div className="mt-6 w-20 h-0.75 bg-[#12D6C3] mx-auto rounded-full"></div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="
                group relative
                bg-white/10 backdrop-blur-xl
                border border-white/10
                rounded-2xl
                p-6
                text-white
                transition-all duration-300
                hover:-translate-y-2
                hover:bg-white/15
                hover:border-[#12D6C3]/40
              "
            >
              {/* glow border on hover */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-300 bg-linear-to-r from-[#12D6C3]/10 to-transparent blur-xl"></div>

              {/* Icon */}
              <div className="relative w-12 h-12 flex items-center justify-center rounded-xl bg-[#12D6C3]/20 text-[#12D6C3] mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h3 className="relative text-lg font-semibold">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="relative mt-2 text-sm text-gray-200 leading-relaxed">
                {feature.description}
              </p>

              {/* Link */}
              <a
                href="#"
                className="
                  relative mt-5 inline-flex items-center gap-2
                  text-[#12D6C3] text-sm font-medium
                  group-hover:gap-3 transition-all duration-300
                "
              >
                Learn More
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
