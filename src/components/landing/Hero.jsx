import React from "react";
import { Link } from "react-router-dom";
// import hero_img from "../../assets/hero_img.png";
import in3 from "../../assets/in3.png";
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
              src={in3}
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






// import React from "react";
// import { Link } from "react-router-dom";
// import hero_img from "../../assets/hero_img.png";
// import { useSelector } from "react-redux";

// const Hero = () => {
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   return (
//     <section className="relative bg-gradient-to-b from-[#0f171e] via-[#1a262f] to-[#0f171e] min-h-screen flex items-center pt-24 pb-16 overflow-hidden select-none">
//       {/* Background Ambient Glow FX */}
//       <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#12D6C3]/15 rounded-full blur-[130px] pointer-events-none" />
//       <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#F28C38]/10 rounded-full blur-[100px] pointer-events-none" />

//       <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
//           {/* Left Content */}
//           <div className="text-center lg:text-left flex flex-col items-center lg:items-start">
            
//             {/* Pill Badge */}
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12D6C3]/10 border border-[#12D6C3]/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(18,214,195,0.15)] transition-all hover:border-[#12D6C3]/60">
//               <span className="w-2 h-2 rounded-full bg-[#12D6C3] animate-pulse" />
//               <span className="text-xs sm:text-sm font-semibold text-[#12D6C3] tracking-wide uppercase">
//                 AI-Powered Invoice Management
//               </span>
//             </div>

//             {/* Main Headline */}
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
//               Automate Your{" "}
//               <span className="bg-gradient-to-r from-[#12D6C3] via-[#3bf0de] to-[#12D6C3] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(18,214,195,0.3)]">
//                 Invoicing Workflow
//               </span>{" "}
//               with AI
//             </h1>

//             {/* Description */}
//             <p className="mt-6 text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl font-normal">
//               Let AI create professional invoices from simple text prompts,
//               automate payment reminders, track payments, and provide valuable
//               insights to help you manage your finances effortlessly.
//             </p>

//             {/* Call To Action Buttons */}
//             <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start">
//               {isAuthenticated ? (
//                 <Link
//                   to="/dashboard"
//                   className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-900 bg-[#12D6C3] rounded-xl shadow-[0_0_25px_rgba(18,214,195,0.4)] hover:shadow-[0_0_35px_rgba(18,214,195,0.6)] hover:bg-[#10c4b3] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
//                 >
//                   <span>Go to Dashboard</span>
//                   <svg className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </Link>
//               ) : (
//                 <Link
//                   to="/signup"
//                   className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-[#F28C38] to-[#e07722] rounded-xl shadow-[0_4px_20px_rgba(242,140,56,0.35)] hover:shadow-[0_6px_25px_rgba(242,140,56,0.5)] hover:from-[#e67e22] hover:to-[#d36a13] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
//                 >
//                   Get Started for Free
//                 </Link>
//               )}

//               <a
//                 href="#features"
//                 className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-200 border border-slate-700 hover:border-[#12D6C3]/50 bg-slate-800/40 hover:bg-slate-800/80 rounded-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
//               >
//                 Learn More
//               </a>
//             </div>

//           </div>

//           {/* Right Image Container */}
//           <div className="relative flex justify-center lg:justify-end">
//             {/* Image Glow Effect Behind */}
//             <div className="absolute inset-0 bg-gradient-to-tr from-[#12D6C3]/20 to-transparent rounded-3xl blur-2xl transform scale-95" />
            
//             <div className="relative p-2 bg-gradient-to-b from-slate-700/50 to-slate-800/50 rounded-3xl border border-slate-700/60 backdrop-blur-xl shadow-2xl transition-transform duration-500 hover:scale-[1.01]">
//               <img
//                 src={hero_img}
//                 alt="Invoice App Dashboard"
//                 className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl rounded-2xl object-cover shadow-inner"
//               />
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;