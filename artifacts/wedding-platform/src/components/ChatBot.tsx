import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Minimize2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  "How do I book a venue?",
  "What vendors are available?",
  "How much does it cost?",
  "Do you plan destination weddings?",
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
    return "I'm having trouble connecting right now. Please call us at +91 8796318282 for immediate assistance.";
  }
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Namaste! 🙏 Welcome to Book My Squad. I'm your wedding planning assistant. How can I help you plan your dream celebration?",
      timestamp: new Date(),
    },
  ]);
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

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(212,175,55,0.5)] hover:bg-primary/90 transition-all duration-300 hover:scale-110 group"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6 text-black" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#080604]" />
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[200] w-[360px] max-w-[calc(100vw-2rem)] shadow-2xl flex flex-col"
            style={{
              height: minimized ? "auto" : "520px",
              background: "#0d0a07",
              border: "1px solid rgba(212,175,55,0.25)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-primary/20 bg-[#0a0806]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-cinzel text-[11px] tracking-[0.2em] text-primary uppercase font-semibold">BMS Assistant</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="font-manrope text-[10px] text-white/40">Online · Usually replies instantly</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMinimized(m => !m)}
                  className="text-white/40 hover:text-primary transition-colors p-1"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="text-white/40 hover:text-primary transition-colors p-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!minimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${msg.role === "assistant" ? "bg-primary/15 border border-primary/30" : "bg-white/10 border border-white/20"}`}>
                        {msg.role === "assistant"
                          ? <Bot className="w-3.5 h-3.5 text-primary" />
                          : <User className="w-3.5 h-3.5 text-white/60" />
                        }
                      </div>
                      <div className={`max-w-[78%] px-3.5 py-2.5 text-sm font-manrope leading-relaxed ${
                        msg.role === "assistant"
                          ? "bg-white/5 border border-white/8 text-white/85 rounded-tr-lg rounded-br-lg rounded-bl-sm"
                          : "bg-primary/90 text-black rounded-tl-lg rounded-bl-lg rounded-br-sm font-medium"
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                        <Bot className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="bg-white/5 border border-white/8 px-4 py-3 rounded-tr-lg rounded-br-lg rounded-bl-sm">
                        <div className="flex gap-1.5 items-center h-4">
                          {[0,1,2].map(i => (
                            <motion.span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full bg-primary/60"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={endRef} />
                </div>

                {/* Quick questions */}
                {messages.length <= 1 && (
                  <div className="px-4 pb-2 flex flex-wrap gap-2">
                    {QUICK_QUESTIONS.map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="font-manrope text-[10px] text-primary/80 border border-primary/25 px-2.5 py-1.5 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 rounded-sm"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="border-t border-white/8 p-3 flex gap-2.5 bg-[#0a0806]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && send()}
                    placeholder="Ask about venues, vendors, pricing..."
                    className="flex-1 bg-white/5 border border-white/10 focus:border-primary/40 outline-none px-3.5 py-2.5 font-manrope text-sm text-white/85 placeholder:text-white/25 transition-colors rounded-sm"
                    disabled={loading}
                  />
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="w-10 h-10 bg-primary flex items-center justify-center rounded-sm disabled:opacity-40 hover:bg-primary/85 transition-all shrink-0"
                  >
                    <Send className="w-4 h-4 text-black" />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
