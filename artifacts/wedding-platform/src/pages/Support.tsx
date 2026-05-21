import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useMeta } from "@/hooks/useMeta";

const SUPPORT_CARDS = [
  {
    title: "Customer Support",
    contact: "support@bookmysquad.com",
    description: "For bookings and general assistance.",
    icon: Mail,
  },
  {
    title: "Vendor Support",
    contact: "business@bookmysquad.com",
    description: "For vendor listings and partnership enquiries.",
    icon: ArrowRight,
  },
  {
    title: "Phone Support",
    contact: "+91 98877 66554",
    description: "Mon–Sat | 10 AM – 7 PM",
    icon: Phone,
  },
];

const FAQS = [
  {
    question: "How long does support take?",
    answer: "Most requests receive a response within 24 business hours.",
  },
  {
    question: "How do bookings work?",
    answer: "Customers connect directly with verified vendors after selecting the right partner for their wedding.",
  },
  {
    question: "Can I list my business?",
    answer: "Yes. Visit the List Business section to submit your vendor profile for review.",
  },
];

export default function Support() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [formStatus, setFormStatus] = useState<string>("");

  useMeta({
    title: "Support | Book My Squad",
    description: "Premium customer support page for Book My Squad with contact options, FAQ, and direct messaging.",
    keywords: "support, customer support, vendor support, wedding assistance, premium support",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus("Your message has been prepared. A support specialist will follow up within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-[#050302] text-white font-sans">
      <Navbar />

      <main className="relative overflow-hidden pt-24 px-6 md:px-12 pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_30%),radial-gradient(circle_at_bottom,rgba(255,190,70,0.05),transparent_25%)] pointer-events-none" />

        <section className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="relative inline-flex items-center justify-center px-4 py-2 mb-6 rounded-full bg-black/50 border border-white/10 backdrop-blur-xl">
            <span className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70">✦ CUSTOMER SUPPORT ✦</span>
          </div>
          <h1 className="font-cormorant text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight" style={{ textShadow: "0 0 32px rgba(255,205,95,0.16)" }}>
            We’re Here To Help
          </h1>
          <p className="font-manrope text-white/70 max-w-2xl mx-auto mt-6 text-base md:text-lg leading-8">
            Need assistance with bookings, vendor listings, payments, or platform support? Our team is here to assist you.
          </p>
        </section>

        <motion.section
          className="relative z-10 mx-auto mt-20 max-w-6xl space-y-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {SUPPORT_CARDS.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className="group rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:-translate-y-1 hover:border-primary/40"
                >
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="w-12 h-12 rounded-3xl bg-[#11100e]/80 border border-primary/20 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-cinzel text-[9px] tracking-[0.35em] uppercase text-primary/70">Premium</span>
                  </div>
                  <h2 className="font-cormorant text-2xl text-white leading-tight mb-3">{card.title}</h2>
                  <p className="font-manrope text-sm text-white/70 leading-relaxed mb-6">{card.description}</p>
                  <p className="font-manrope text-sm text-white/90 break-words">{card.contact}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
              <div className="mb-8">
                <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Send a Message</div>
                <h2 className="font-cormorant text-3xl text-white leading-tight">Start a conversation with our team.</h2>
                <p className="font-manrope text-sm text-white/70 leading-relaxed mt-4">
                  Share a few details and we'll route your request to the right specialist.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="flex flex-col gap-3 text-sm text-white/60">
                    Full Name
                    <input
                      required
                      placeholder="Your full name"
                      className="rounded-3xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                  <label className="flex flex-col gap-3 text-sm text-white/60">
                    Email Address
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="rounded-3xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-3 text-sm text-white/60">
                  Subject
                  <input
                    required
                    placeholder="Subject"
                    className="rounded-3xl bg-black/60 border border-white/10 px-4 py-3 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <label className="flex flex-col gap-3 text-sm text-white/60">
                  Message
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us how we can help"
                    className="min-h-[180px] resize-none rounded-[1.75rem] bg-black/60 border border-white/10 px-4 py-4 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-[#d4b951] px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110"
                >
                  SEND MESSAGE
                </button>
                {formStatus && <p className="font-manrope text-sm text-primary/80">{formStatus}</p>}
              </form>
            </div>

            <div className="rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-3">Need faster assistance?</div>
              <h2 className="font-cormorant text-3xl text-white leading-tight mb-4">Chat directly with our support team.</h2>
              <p className="font-manrope text-sm text-white/70 leading-relaxed mb-8">
                For quick responses to urgent questions, reach out on WhatsApp and get premium support instantly.
              </p>
              <a
                href="https://wa.me/919887766554"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full rounded-full border border-primary/30 bg-black/50 px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:border-primary hover:bg-primary/10 hover:text-primary"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                CHAT ON WHATSAPP
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="font-cinzel text-[10px] tracking-[0.35em] uppercase text-primary/70 mb-6">Frequently Asked Questions</div>
            <div className="space-y-4">
              {FAQS.map((faq, index) => {
                const open = activeFaq === index;
                return (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() => setActiveFaq(open ? null : index)}
                    className="w-full text-left rounded-[1.75rem] border border-white/10 bg-black/50 px-6 py-5 transition hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-cormorant text-xl text-white">{faq.question}</h3>
                        <p className="font-manrope text-sm text-white/50 mt-2">{open ? "Tap to collapse" : "Tap to expand"}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                    </div>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.25 }}
                        className="mt-5 overflow-hidden"
                      >
                        <p className="font-manrope text-sm text-white/70 leading-relaxed">{faq.answer}</p>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}
