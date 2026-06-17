import React from 'react'
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "../../utils/data";

const Testimonials = () => {
  return (
<section
  id="testimonials"
  className="py-24 bg-[#55636A] text-white relative overflow-hidden"
>
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">
        What Our Customers Say
      </h2>

      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
        Trusted by freelancers, agencies, and small businesses worldwide.
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {TESTIMONIALS.map((testimonial, index) => (
        <div
          key={index}
          className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 hover:border-[#12D6C3]/50 hover:-translate-y-2 transition-all duration-300"
        >
          <div className="mb-6">
            <Quote className="w-10 h-10 text-[#12D6C3]" />
          </div>

          <p className="text-gray-200 leading-relaxed mb-8">
            "{testimonial.quote}"
          </p>

          <div className="flex items-center gap-4">
            <img
              src={testimonial.avatar}
              alt={testimonial.author}
              className="w-14 h-14 rounded-full border-2 border-[#F28C38]"
            />

            <div>
              <h4 className="font-semibold text-white">
                {testimonial.author}
              </h4>

              <p className="text-sm text-gray-400">
                {testimonial.title}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Background Glow */}
  <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#12D6C3]/10 blur-[140px] rounded-full"></div>

  <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#F28C38]/10 blur-[140px] rounded-full"></div>
</section>
  )
}

export default Testimonials