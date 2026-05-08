import { useState } from "react";
import { motion } from "framer-motion";
import { PaperAirplaneIcon, MapPinIcon } from "@heroicons/react/24/solid";

export default function ContactForm({ raisedShadow, insetShadow }: { 
  raisedShadow?: string; 
  insetShadow?: string;
}) {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    message: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);

    const whatsappNumber = "919399345989";
    const message = `New Contact Form Submission:\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nMessage: ${form.message}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");

    setForm({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
    alert("Your message has been prepared in WhatsApp. Please send it to confirm.");
  }

  return (
    <section id="contact" className="py-20 bg-[#e0e5ec]">
      <div className="container mx-auto px-6">
        <div className={`max-w-6xl mx-auto rounded-3xl bg-[#e0e5ec] ${raisedShadow} p-8 md:p-12 lg:p-16`}>
          
          <div className="grid gap-12 md:grid-cols-2 items-start">
            
            {/* Left Side - Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-3xl bg-[#e0e5ec] shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] mb-6">
                  <MapPinIcon className="w-5 h-5 text-emerald-600" />
                  <span className="font-semibold text-emerald-700">Get In Touch</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
                  Start Your Journey Today
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Have questions about courses, schedules, or fees? 
                  Send us a message via WhatsApp. Our team will respond quickly.
                </p>
              </div>

              {/* Neumorphic Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl bg-[#e0e5ec] ${insetShadow} 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                        text-gray-700 placeholder:text-gray-400 transition-all`}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full px-6 py-4 rounded-2xl bg-[#e0e5ec] ${insetShadow} 
                        focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                        text-gray-700 placeholder:text-gray-400 transition-all`}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Phone Number</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`w-full px-6 py-4 rounded-2xl bg-[#e0e5ec] ${insetShadow} 
                      focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                      text-gray-700 placeholder:text-gray-400 transition-all`}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Your Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-6 py-4 rounded-3xl bg-[#e0e5ec] ${insetShadow} resize-y min-h-[140px]
                      focus:outline-none focus:ring-2 focus:ring-emerald-400/50 
                      text-gray-700 placeholder:text-gray-400 transition-all`}
                    placeholder="Tell us about your goals, course interest, or any questions..."
                    required
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-8 rounded-3xl font-semibold text-lg flex items-center justify-center gap-3 
                    bg-[#e0e5ec] ${raisedShadow} 
                    hover:shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff] 
                    active:${insetShadow} 
                    text-gray-800 disabled:opacity-70 transition-all duration-300`}
                >
                  {isSubmitting ? (
                    "Preparing WhatsApp Message..."
                  ) : (
                    <>
                      Send via WhatsApp
                      <PaperAirplaneIcon className="w-6 h-6" />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Right Side - Google Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className={`rounded-3xl overflow-hidden bg-[#e0e5ec] ${raisedShadow} p-3 shadow-inner`}>
                <div className="rounded-2xl overflow-hidden border border-gray-200/50">
                  <iframe
                    title="Skill Training Center Nagpur Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.337405892367!2d79.067185!3d21.1363751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c1000c0583e5%3A0x2a9d4b509fe5934e!2sSS%20Infotech%20Nagpur!5e0!3m2!1sen!2sin!4v1695739200000!5m2!1sen!2sin"
                    width="100%"
                    height="460"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    className="border-0 w-full"
                  />
                </div>
              </div>

              {/* Floating Info Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 bg-[#e0e5ec] px-5 py-3 rounded-2xl text-sm font-medium shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]"
              >
                📍 SS Infotech, Nagpur
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}