import React from "react";
import { Link } from "react-router-dom";
import hero_img from "../../assets/hero_img.png";
import { useSelector } from "react-redux";

const Hero = () => {
const { isAuthenticated } = useSelector((state)=> state.auth)

  return (
   <section className="bg-[#55636A] min-h-screen flex items-center pt-20 sm:pt-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <span
              className="inline-flex items-center justify-center  px-2.5 py-1 text-[10px] sm:px-3 sm:py-1.5 sm:text-xs md:px-4 md:py-2 md:text-sm rounded-full bg-[#12D6C3]/10 text-[#12D6C3] font-medium mb-4 sm:mb-6 w-fit mx-auto lg:mx-0"
            >
              AI-Powered Invoice Management
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Automate Your{" "}
              <span className="text-[#12D6C3]">Invoicing Workflow</span> with AI
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Let AI create professional invoices from simple text prompts,
              automate payment reminders, track payments, and provide valuable
              insights to help you manage your finances efficiently.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-3 sm:px-6 bg-[#12D6C3] hover:bg-[#0FC0AF] text-white rounded-lg font-medium transition-all duration-300 text-center"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="px-5 py-3 sm:px-6 bg-[#F28C38] hover:bg-[#E67E22] text-white rounded-lg font-medium transition-all duration-300 text-center"
                >
                  Get Started for Free
                </Link>
              )}

              <a
                href="#features"
                className="px-5 py-3 sm:px-6 border border-[#12D6C3] text-[#12D6C3] rounded-lg font-medium hover:bg-[#12D6C3]/10 transition-all duration-300 text-center"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={hero_img}
              alt="Invoice App Dashboard"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
