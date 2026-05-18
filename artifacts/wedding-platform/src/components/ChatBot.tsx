import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User, Minimize2, Trash2, Sparkles,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const WELCOME_MSG: Message = {
  id: "welcome",
  role: "assistant",
  content: "Namaste! 🙏 Welcome to Book My Squad. I'm your personal wedding & event planning assistant. Ask me anything — venues, vendors, pricing, planning tips!",
  timestamp: new Date(),
};

const QUICK_QUESTIONS = [
  "How do I book a venue?",
  "What vendors are available?",
  "How much does wedding planning cost?",
  "Do you plan destination weddings?",
  "How do I shortlist vendors?",
  "What cities are you available in?",
  "How does GST verification work?",
  "Can I get a customised package?",
];

const CATEGORIES = [
  { label: "🏛 Venues", q: "Show me wedding venue options in India" },
  { label: "📸 Photography", q: "Tell me about photography packages" },
  { label: "💄 Makeup", q: "What bridal makeup artists are listed?" },
  { label: "🎵 Entertainment", q: "What entertainment options do you have?" },
];

const BASE_URL = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

async function sendChat(messages: { role: string; content: string }[]): Promise<string> {
  try {
    const res = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ messages }),
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json() as { reply?: string };
    return data.reply || "I'm here to help! Please try again.";
  } catch {
    return "I'm having trouble connecting right now. For immediate assistance, browse our vendor directory or contact a listed vendor directly.";
  }
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && !minimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, minimized]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    setShowClearConfirm(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));
    const reply = await sendChat(history);

    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply,
      timestamp: new Date(),
    }]);
    setLoading(false);
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME_MSG, timestamp: new Date() }]);
    setShowClearConfirm(false);
  };

  const isFirstMessage = messages.length <= 1;

  return (
    <>
      {/* Floating trigger button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(212,175,55,0.55)] hover:bg-primary/90 transition-all duration-300 hover:scale-110 group"
            aria-label="Open BMS Assistant"
          >
            <MessageCircle className="w-6 h-6 text-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#080604]" />
            {/* Tooltip */}
            <span className="absolute right-full mr-3 whitespace-nowrap bg-[#0d0a07] border border-primary/25 text-white/75 font-manrope text-[11px] px-3 py-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              Ask BMS Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[200] w-[420px] max-w-[calc(100vw-2rem)] shadow-2xl flex flex-col"
            style={{
              height: minimized ? "auto" : "560px",
              background: "#0d0a07",
              border: "1px solid rgba(212,175,55,0.25)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.08)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-[#0a0806] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-[#0a0806]" />
                </div>
                <div>
                  <p className="font-cinzel text-[11px] tracking-[0.2em] text-primary uppercase font-semibold">BMS Assistant</p>
                  <p className="font-manrope text-[10px] text-white/40">Online · AI-powered · Always available</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 1 && (
                  <button
                    onClick={() => setShowClearConfirm(c => !c)}
                    className="text-white/30 hover:text-red-400 transition-colors p-1.5 rounded-sm hover:bg-red-400/5"
                    title="Clear conversation"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setMinimized(m => !m)}
                  className="text-white/30 hover:text-primary transition-colors p-1.5"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/30 hover:text-primary transition-colors p-1.5"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Clear confirm banner */}
            <AnimatePresence>
              {showClearConfirm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden shrink-0"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-red-500/8 border-b border-red-400/15">
                    <span className="font-manrope text-xs text-red-400/80">Clear this conversation?</span>
                    <div className="flex gap-2">
                      <button onClick={clearChat} className="font-cinzel text-[9px] tracking-widest uppercase text-red-400 hover:text-red-300 transition-colors">Yes</button>
                      <button onClick={() => setShowClearConfirm(false)} className="font-cinzel text-[9px] tracking-widest uppercase text-white/30 hover:text-white/60 transition-colors">Cancel</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">

                  {/* Welcome screen with category chips */}
                  {isFirstMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-2"
                    >
                      <div className="mb-3 flex gap-2.5 flex-wrap">
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat.label}
                            onClick={() => send(cat.q)}
                            className="font-manrope text-[11px] text-white/65 border border-white/10 hover:border-primary/35 hover:text-primary/80 bg-white/[0.02] hover:bg-primary/5 px-3 py-1.5 rounded-sm transition-all duration-200 whitespace-nowrap"
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2.5 group ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === "assistant"
                          ? "bg-primary/15 border border-primary/30"
                          : "bg-white/10 border border-white/20"
                      }`}>
                        {msg.role === "assistant"
                          ? <Sparkles className="w-3.5 h-3.5 text-primary" />
                          : <User className="w-3.5 h-3.5 text-white/60" />
                        }
                      </div>
                      <div className="max-w-[80%]">
                        <div className={`px-3.5 py-2.5 text-sm font-manrope leading-relaxed ${
                          msg.role === "assistant"
                            ? "bg-white/5 border border-white/8 text-white/85 rounded-tr-xl rounded-br-xl rounded-bl-sm"
                            : "bg-primary text-black rounded-tl-xl rounded-bl-xl rounded-br-sm font-medium"
                        }`}>
                          {msg.content}
                        </div>
                        <p className={`font-manrope text-[9px] text-white/20 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-tr-xl rounded-br-xl rounded-bl-sm">
                        <div className="flex gap-1 items-end h-4">
                          {[0, 1, 2].map(i => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-primary/60"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={endRef} />
                </div>

                {/* Quick questions — shown only at start */}
                {isFirstMessage && (
                  <div className="px-4 pb-3 shrink-0">
                    <p className="font-cinzel text-[8px] tracking-[0.3em] text-white/25 uppercase mb-2">Suggested Questions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_QUESTIONS.map(q => (
                        <button
                          key={q}
                          onClick={() => send(q)}
                          className="font-manrope text-[10px] text-primary/75 border border-primary/20 px-2.5 py-1 hover:bg-primary/8 hover:border-primary/40 hover:text-primary transition-all duration-200 rounded-sm"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-white/8 p-3 flex gap-2.5 bg-[#0a0806] shrink-0">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && void send()}
                    placeholder="Ask about venues, vendors, pricing…"
                    className="flex-1 bg-white/4 border border-white/10 focus:border-primary/40 outline-none px-3.5 py-2.5 font-manrope text-sm text-white/85 placeholder:text-white/25 transition-colors rounded-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={() => void send()}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm disabled:opacity-35 hover:bg-primary/85 transition-all shrink-0 hover:shadow-[0_0_16px_rgba(212,175,55,0.4)]"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>

                {/* Footer */}
                <div className="px-4 pb-2.5 shrink-0">
                  <p className="font-manrope text-[9px] text-white/18 text-center">Powered by AI · Book My Squad</p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
