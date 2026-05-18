import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckSquare, Square, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { useMeta } from "@/hooks/useMeta";

const STORAGE_KEY = "bms_wedding_checklist";

interface Task {
  id: string;
  text: string;
  done: boolean;
  dueLabel?: string;
}

interface Category {
  id: string;
  label: string;
  emoji: string;
  tasks: Task[];
  collapsed: boolean;
}

const DEFAULT_CATEGORIES: Omit<Category, "collapsed">[] = [
  {
    id: "venue",
    label: "Venue",
    emoji: "🏛",
    tasks: [
      { id: "v1", text: "Research and shortlist 5–10 venues", done: false, dueLabel: "12 months before" },
      { id: "v2", text: "Schedule venue walkthroughs", done: false, dueLabel: "10 months before" },
      { id: "v3", text: "Review venue contracts & catering policies", done: false, dueLabel: "10 months before" },
      { id: "v4", text: "Book and confirm the venue", done: false, dueLabel: "8 months before" },
      { id: "v5", text: "Arrange site visit closer to the date", done: false, dueLabel: "1 month before" },
    ],
  },
  {
    id: "catering",
    label: "Catering & Food",
    emoji: "🍛",
    tasks: [
      { id: "c1", text: "Decide on catering style (buffet / plated / live counters)", done: false, dueLabel: "9 months before" },
      { id: "c2", text: "Conduct tasting sessions with shortlisted caterers", done: false, dueLabel: "7 months before" },
      { id: "c3", text: "Finalise menu — starters, mains, desserts, mocktails", done: false, dueLabel: "6 months before" },
      { id: "c4", text: "Confirm dietary requirements for guests", done: false, dueLabel: "2 months before" },
      { id: "c5", text: "Arrange cake / mithai wall", done: false, dueLabel: "3 months before" },
    ],
  },
  {
    id: "photography",
    label: "Photography & Film",
    emoji: "📷",
    tasks: [
      { id: "p1", text: "Research photographers — review portfolios", done: false, dueLabel: "10 months before" },
      { id: "p2", text: "Book lead photographer + videographer", done: false, dueLabel: "8 months before" },
      { id: "p3", text: "Plan pre-wedding shoot locations", done: false, dueLabel: "4 months before" },
      { id: "p4", text: "Prepare shot list & key family combinations", done: false, dueLabel: "2 weeks before" },
      { id: "p5", text: "Arrange drone permit if required", done: false, dueLabel: "1 month before" },
    ],
  },
  {
    id: "decor",
    label: "Decor & Florals",
    emoji: "💐",
    tasks: [
      { id: "d1", text: "Finalise colour palette and overall theme", done: false, dueLabel: "9 months before" },
      { id: "d2", text: "Meet decorators and get quotes", done: false, dueLabel: "7 months before" },
      { id: "d3", text: "Book decorator — stage, mandap, table settings", done: false, dueLabel: "6 months before" },
      { id: "d4", text: "Select floral arrangements & centrepieces", done: false, dueLabel: "3 months before" },
      { id: "d5", text: "Confirm lighting design (fairy lights, uplighting)", done: false, dueLabel: "2 months before" },
    ],
  },
  {
    id: "outfits",
    label: "Outfits & Beauty",
    emoji: "👗",
    tasks: [
      { id: "o1", text: "Visit bridal boutiques & shortlist lehenga / saree", done: false, dueLabel: "8 months before" },
      { id: "o2", text: "First fitting for bridal outfit", done: false, dueLabel: "5 months before" },
      { id: "o3", text: "Coordinate groom's sherwani / suit", done: false, dueLabel: "5 months before" },
      { id: "o4", text: "Choose bridesmaid and family outfits", done: false, dueLabel: "4 months before" },
      { id: "o5", text: "Book hair & makeup artist — trial session", done: false, dueLabel: "3 months before" },
      { id: "o6", text: "Final fittings & alterations", done: false, dueLabel: "3 weeks before" },
    ],
  },
  {
    id: "invitations",
    label: "Invitations & Stationery",
    emoji: "✉️",
    tasks: [
      { id: "i1", text: "Finalise guest list with both families", done: false, dueLabel: "6 months before" },
      { id: "i2", text: "Design wedding invite (digital + printed)", done: false, dueLabel: "4 months before" },
      { id: "i3", text: "Send save-the-dates", done: false, dueLabel: "3 months before" },
      { id: "i4", text: "Send formal invitations", done: false, dueLabel: "6 weeks before" },
      { id: "i5", text: "Create wedding website / WhatsApp group", done: false, dueLabel: "3 months before" },
    ],
  },
  {
    id: "logistics",
    label: "Guest Logistics",
    emoji: "🚌",
    tasks: [
      { id: "l1", text: "Block hotel rooms for outstation guests", done: false, dueLabel: "6 months before" },
      { id: "l2", text: "Arrange airport / station pickup transfers", done: false, dueLabel: "2 months before" },
      { id: "l3", text: "Organise shuttle buses for ceremony to reception", done: false, dueLabel: "1 month before" },
      { id: "l4", text: "Confirm seating chart & table plan", done: false, dueLabel: "2 weeks before" },
      { id: "l5", text: "Send final schedule to immediate family", done: false, dueLabel: "1 week before" },
    ],
  },
  {
    id: "ceremonies",
    label: "Ceremonies & Rituals",
    emoji: "🪔",
    tasks: [
      { id: "ce1", text: "Finalise pandit / officiant and ceremony rituals", done: false, dueLabel: "6 months before" },
      { id: "ce2", text: "Book mehendi artist", done: false, dueLabel: "5 months before" },
      { id: "ce3", text: "Plan Sangeet performances & choreography", done: false, dueLabel: "4 months before" },
      { id: "ce4", text: "Prepare ceremony programme / schedule", done: false, dueLabel: "6 weeks before" },
      { id: "ce5", text: "Confirm musicians / DJ / band", done: false, dueLabel: "4 months before" },
    ],
  },
  {
    id: "honeymoon",
    label: "Honeymoon",
    emoji: "✈️",
    tasks: [
      { id: "h1", text: "Research honeymoon destinations", done: false, dueLabel: "8 months before" },
      { id: "h2", text: "Book flights and accommodation", done: false, dueLabel: "5 months before" },
      { id: "h3", text: "Apply for visas (if international)", done: false, dueLabel: "4 months before" },
      { id: "h4", text: "Pack essentials — passports, travel docs", done: false, dueLabel: "3 days before" },
    ],
  },
];

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

function loadCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Category[];
  } catch {}
  return DEFAULT_CATEGORIES.map(c => ({ ...c, collapsed: false }));
}

function saveCategories(cats: Category[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cats)); } catch {}
}

export default function Checklist() {
  useMeta({ title: "Wedding Checklist", description: "Your personalised wedding planning checklist. Track every task from venue booking to the honeymoon.", keywords: "wedding checklist, wedding planning, wedding to-do" });

  const [cats, setCats] = useState<Category[]>(loadCategories);
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});
  const [addingTo, setAddingTo] = useState<string | null>(null);

  useEffect(() => { saveCategories(cats); }, [cats]);

  const toggleTask = useCallback((catId: string, taskId: string) => {
    setCats(prev => prev.map(c => c.id !== catId ? c : {
      ...c,
      tasks: c.tasks.map(t => t.id !== taskId ? t : { ...t, done: !t.done }),
    }));
  }, []);

  const deleteTask = useCallback((catId: string, taskId: string) => {
    setCats(prev => prev.map(c => c.id !== catId ? c : {
      ...c, tasks: c.tasks.filter(t => t.id !== taskId),
    }));
  }, []);

  const addTask = useCallback((catId: string) => {
    const text = (newTaskText[catId] ?? "").trim();
    if (!text) return;
    setCats(prev => prev.map(c => c.id !== catId ? c : {
      ...c, tasks: [...c.tasks, { id: generateId(), text, done: false }],
    }));
    setNewTaskText(prev => ({ ...prev, [catId]: "" }));
    setAddingTo(null);
  }, [newTaskText]);

  const toggleCollapse = useCallback((catId: string) => {
    setCats(prev => prev.map(c => c.id !== catId ? c : { ...c, collapsed: !c.collapsed }));
  }, []);

  const resetAll = () => {
    if (!confirm("Reset all tasks to default? This cannot be undone.")) return;
    setCats(DEFAULT_CATEGORIES.map(c => ({ ...c, collapsed: false })));
  };

  const totalTasks = cats.reduce((s, c) => s + c.tasks.length, 0);
  const doneTasks  = cats.reduce((s, c) => s + c.tasks.filter(t => t.done).length, 0);
  const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#080604] text-white">
      <Navbar />

      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 px-6 md:px-12 bg-gradient-to-b from-[#0d0a07] to-[#080604] border-b border-white/[0.06]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-cinzel text-[10px] tracking-[0.35em] text-primary/70 uppercase mb-4">Your Journey</p>
            <h1 className="font-cormorant text-4xl md:text-6xl text-white mb-4 leading-tight">
              Wedding Checklist
            </h1>
            <p className="font-manrope text-white/50 text-sm font-light max-w-xl mx-auto mb-10">
              Every detail, accounted for. Track your wedding planning progress across all key categories.
            </p>

            {/* Progress */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel text-[9px] tracking-[0.25em] text-white/30 uppercase">Progress</span>
                <span className="font-cormorant text-2xl text-primary">{pct}%</span>
              </div>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary/70 to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <p className="font-manrope text-white/30 text-xs mt-2 font-light">{doneTasks} of {totalTasks} tasks complete</p>
            </div>
          </div>
        </section>

        {/* Controls */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
          <p className="font-cinzel text-[9px] tracking-[0.25em] text-white/25 uppercase">{cats.length} categories</p>
          <button onClick={resetAll} className="font-cinzel text-[9px] tracking-[0.18em] text-white/25 uppercase hover:text-red-400/70 transition-colors">
            Reset All
          </button>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-20 space-y-4">
          {cats.map(cat => {
            const done  = cat.tasks.filter(t => t.done).length;
            const total = cat.tasks.length;
            return (
              <motion.div
                key={cat.id}
                layout
                className="border border-white/[0.07] bg-white/[0.025] overflow-hidden"
              >
                {/* Category header */}
                <button
                  onClick={() => toggleCollapse(cat.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/[0.03] transition-colors group"
                >
                  <span className="text-xl shrink-0">{cat.emoji}</span>
                  <div className="flex-1 text-left">
                    <p className="font-cinzel text-[11px] tracking-[0.2em] text-white/80 uppercase group-hover:text-white transition-colors">
                      {cat.label}
                    </p>
                    <p className="font-manrope text-[11px] text-white/30 font-light mt-0.5">{done}/{total} done</p>
                  </div>
                  {/* mini progress */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <div className="w-24 h-0.5 bg-white/[0.08] rounded-full overflow-hidden">
                      <div className="h-full bg-primary/60 rounded-full transition-all duration-500"
                        style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }} />
                    </div>
                  </div>
                  <span className="text-white/25 group-hover:text-white/50 transition-colors ml-2">
                    {cat.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {!cat.collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.05] divide-y divide-white/[0.04]">
                        {cat.tasks.map(task => (
                          <motion.div
                            key={task.id}
                            layout
                            className="flex items-start gap-3 px-6 py-3.5 group hover:bg-white/[0.02] transition-colors"
                          >
                            <button
                              onClick={() => toggleTask(cat.id, task.id)}
                              className={`mt-0.5 shrink-0 transition-colors ${task.done ? "text-primary" : "text-white/20 hover:text-primary/60"}`}
                            >
                              {task.done
                                ? <CheckSquare className="w-4 h-4" />
                                : <Square className="w-4 h-4" />}
                            </button>
                            <div className="flex-1 min-w-0">
                              <p className={`font-manrope text-sm font-light leading-relaxed transition-colors ${task.done ? "line-through text-white/25" : "text-white/75"}`}>
                                {task.text}
                              </p>
                              {task.dueLabel && (
                                <p className="font-cinzel text-[9px] tracking-[0.15em] text-white/20 uppercase mt-0.5">
                                  {task.dueLabel}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => deleteTask(cat.id, task.id)}
                              className="shrink-0 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400/70 transition-all mt-0.5"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}

                        {/* Add task row */}
                        <div className="px-6 py-3">
                          {addingTo === cat.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                type="text"
                                value={newTaskText[cat.id] ?? ""}
                                onChange={e => setNewTaskText(p => ({ ...p, [cat.id]: e.target.value }))}
                                onKeyDown={e => { if (e.key === "Enter") addTask(cat.id); if (e.key === "Escape") setAddingTo(null); }}
                                placeholder="Task description…"
                                className="flex-1 bg-transparent border-b border-white/20 text-white/70 text-sm font-manrope font-light py-1 focus:outline-none focus:border-primary/50 placeholder-white/20"
                              />
                              <button onClick={() => addTask(cat.id)} className="font-cinzel text-[9px] tracking-widest text-primary uppercase hover:text-primary/70 transition-colors px-2">Add</button>
                              <button onClick={() => setAddingTo(null)} className="font-cinzel text-[9px] tracking-widest text-white/25 uppercase hover:text-white/50 transition-colors px-1">Cancel</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAddingTo(cat.id)}
                              className="flex items-center gap-2 text-white/20 hover:text-primary/60 transition-colors group/add"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span className="font-cinzel text-[9px] tracking-[0.2em] uppercase">Add Task</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
