import React from "react";
import { FileText, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
   <footer className="bg-[#55636A] border-t border-white/10">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#12D6C3]/10 blur-[150px] rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F28C38]/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-[#12D6C3] p-3 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white">
                  InvoiceAI
                </h3>

                <span className="text-[#12D6C3] text-sm">
                  AI Powered Invoicing
                </span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Create professional invoices in seconds using AI. Automate
              billing, track payments, and manage your business with ease.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Product
            </h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Features
                </a>
              </li>

              <li>
                <a
                  href="#pricing"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Pricing
                </a>
              </li>

              <li>
                <a
                  href="#testimonials"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Testimonials
                </a>
              </li>

              <li>
                <a
                  href="#faq"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Resources
            </h4>

            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Documentation
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Help Center
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-[#12D6C3] hover:translate-x-1 transition-all inline-block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-5">
              Contact
            </h4>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F28C38]" />
                <span className="text-gray-300">
                  support@invoiceai.com
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F28C38]" />
                <span className="text-gray-300">
                  +91 78082 33110
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#F28C38]" />
                <span className="text-gray-300">
                  India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2026 InvoiceAI. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="text-gray-400 hover:text-[#12D6C3] transition"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-gray-400 hover:text-[#12D6C3] transition"
            >
              Terms
            </a>

            <a
              href="#"
              className="text-gray-400 hover:text-[#12D6C3] transition"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;