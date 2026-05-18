import { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Plus, Trash2, ChevronDown, Flag,
  CalendarDays, ListChecks, Trophy, X, Edit2, Check,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
void BASE;

interface Task {
  id: string;
  category: string;
  title: string;
  done: boolean;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  notes?: string;
}

const CATEGORIES = [
  "All",
  "Venue",
  "Catering",
  "Photography",
  "Decoration",
  "Outfits",
  "Beauty",
  "Music & DJ",
  "Invitations",
  "Honeymoon",
  "Other",
];

const CAT_COLOR: Record<string, string> = {
  "Venue":       "#d4af37",
  "Catering":    "#50e3c2",
  "Photography": "#9b8ae0",
  "Decoration":  "#f472b6",
  "Outfits":     "#fb923c",
  "Beauty":      "#e879f9",
  "Music & DJ":  "#38bdf8",
  "Invitations": "#a3e635",
  "Honeymoon":   "#f43f5e",
  "Other":       "#6b7280",
};

const PRIORITY_META = {
  high:   { label: "High",   color: "text-red-400 border-red-400/40 bg-red-400/8" },
  medium: { label: "Medium", color: "text-amber-400 border-amber-400/40 bg-amber-400/8" },
  low:    { label: "Low",    color: "text-green-400 border-green-400/40 bg-green-400/8" },
};

const DEFAULT_TASKS: Omit<Task, "id">[] = [
  // Venue
  { category: "Venue",       title: "Visit shortlisted ceremony venues",         done: false, priority: "high"   },
  { category: "Venue",       title: "Book and sign venue contract",               done: false, priority: "high"   },
  { category: "Venue",       title: "Confirm parking & accommodation for guests", done: false, priority: "medium" },
  // Catering
  { category: "Catering",    title: "Schedule menu tasting",                     done: false, priority: "high"   },
  { category: "Catering",    title: "Confirm final guest headcount",              done: false, priority: "high"   },
  { category: "Catering",    title: "Arrange dietary / allergy requirements",     done: false, priority: "medium" },
  { category: "Catering",    title: "Confirm bar & mocktail package",             done: false, priority: "low"    },
  // Photography
  { category: "Photography", title: "Book photographer & videographer",           done: false, priority: "high"   },
  { category: "Photography", title: "Create must-have shot list",                 done: false, priority: "medium" },
  { category: "Photography", title: "Schedule pre-wedding / mehendi shoot",       done: false, priority: "medium" },
  // Decoration
  { category: "Decoration",  title: "Finalise wedding colour palette & theme",    done: false, priority: "high"   },
  { category: "Decoration",  title: "Meet decorator & review mood board",         done: false, priority: "high"   },
  { category: "Decoration",  title: "Confirm floral arrangements",                done: false, priority: "medium" },
  { category: "Decoration",  title: "Arrange mandap / stage design",              done: false, priority: "high"   },
  // Outfits
  { category: "Outfits",     title: "Bridal lehenga / saree — first fitting",     done: false, priority: "high"   },
  { category: "Outfits",     title: "Groom sherwani — first fitting",             done: false, priority: "high"   },
  { category: "Outfits",     title: "Finalise accessories & jewellery",           done: false, priority: "medium" },
  // Beauty
  { category: "Beauty",      title: "Book bridal makeup artist",                  done: false, priority: "high"   },
  { category: "Beauty",      title: "Complete bridal makeup trial",               done: false, priority: "high"   },
  { category: "Beauty",      title: "Book pre-bridal skin & hair treatments",     done: false, priority: "medium" },
  // Music & DJ
  { category: "Music & DJ",  title: "Book DJ / live band",                        done: false, priority: "high"   },
  { category: "Music & DJ",  title: "Create entrance & reception playlist",       done: false, priority: "medium" },
  { category: "Music & DJ",  title: "Arrange sound system & AV check",            done: false, priority: "medium" },
  // Invitations
  { category: "Invitations", title: "Finalise guest list",                        done: false, priority: "high"   },
  { category: "Invitations", title: "Design & print wedding invitations",         done: false, priority: "high"   },
  { category: "Invitations", title: "Send digital invitations & RSVP",            done: false, priority: "medium" },
  // Honeymoon
  { category: "Honeymoon",   title: "Book honeymoon flights",                     done: false, priority: "medium" },
  { category: "Honeymoon",   title: "Book honeymoon hotel / resort",              done: false, priority: "medium" },
  { category: "Honeymoon",   title: "Apply for visas if required",                done: false, priority: "high"   },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const STORAGE_KEY = "bms_checklist_v1";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Task[];
  } catch { /* ignore */ }
  return DEFAULT_TASKS.map(t => ({ ...t, id: uid() }));
}

function saveTasks(tasks: Task[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch { /* ignore */ }
}

export default function Checklist() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [activeCat, setActiveCat] = useState("All");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Other");
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDue, setNewDue] = useState("");
  const [showDone, setShowDone] = useState(true);

  useEffect(() => { saveTasks(tasks); }, [tasks]);

  const update = useCallback((id: string, patch: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const removeTask = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if (!newTitle.trim()) return;
    const t: Task = { id: uid(), title: newTitle.trim(), category: newCat, done: false, priority: newPriority, dueDate: newDue || undefined };
    setTasks(prev => [...prev, t]);
    setNewTitle(""); setNewDue(""); setShowAdd(false);
  };

  const startEdit = (t: Task) => { setEditingId(t.id); setEditTitle(t.title); };
  const saveEdit  = (id: string) => { update(id, { title: editTitle.trim() || "Untitled" }); setEditingId(null); };

  const visible = tasks.filter(t => {
    if (activeCat !== "All" && t.category !== activeCat) return false;
    if (!showDone && t.done) return false;
    return true;
  });

  const total  = activeCat === "All" ? tasks.length : tasks.filter(t => t.category === activeCat).length;
  const done   = activeCat === "All" ? tasks.filter(t => t.done).length : tasks.filter(t => t.category === activeCat && t.done).length;
  const pct    = total === 0 ? 0 : Math.round((done / total) * 100);

  const catCounts = tasks.reduce<Record<string, { total: number; done: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { total: 0, done: 0 };
    acc[t.category].total++;
    if (t.done) acc[t.category].done++;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#080604] text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">

        {/* Hero */}
        <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06)_0%,transparent_70%)]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="font-cinzel text-[10px] tracking-[0.45em] text-primary/70 uppercase mb-4">✦ Wedding Planner ✦</p>
            <h1 className="font-cormorant text-5xl md:text-6xl font-light mb-4">
              Your Wedding <span className="text-primary italic font-semibold">Checklist</span>
            </h1>
            <p className="font-manrope text-white/55 text-base font-light mb-8">
              Stay on top of every detail — from venue to honeymoon.
            </p>

            {/* Progress */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="font-cinzel text-[9px] tracking-[0.25em] text-white/40 uppercase">Overall Progress</span>
                <span className="font-cormorant text-2xl font-semibold text-primary">{pct}%</span>
              </div>
              <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#b8962e,#d4af37,#f0d060)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </div>
              <p className="font-manrope text-xs text-white/35 mt-2 text-right">{done} of {tasks.length} tasks complete</p>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col lg:flex-row gap-8">

          {/* Sidebar — categories */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-[#0f0c08] border border-white/8 p-4 sticky top-24">
              <p className="font-cinzel text-[9px] tracking-[0.3em] text-primary/60 uppercase mb-4">Categories</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => {
                  const meta  = catCounts[cat];
                  const cDone = cat === "All" ? done  : (meta?.done  ?? 0);
                  const cTot  = cat === "All" ? total : (meta?.total ?? 0);
                  const color = CAT_COLOR[cat] ?? "#d4af37";
                  const active = activeCat === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCat(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-all rounded-sm ${
                        active ? "bg-primary/10 border border-primary/30" : "hover:bg-white/4 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {cat !== "All" && (
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: active ? color : `${color}60` }} />
                        )}
                        {cat === "All" && <ListChecks className={`w-3.5 h-3.5 ${active ? "text-primary" : "text-white/30"}`} />}
                        <span className={`font-cinzel text-[9px] tracking-[0.15em] uppercase ${active ? "text-primary" : "text-white/55"}`}>{cat}</span>
                      </div>
                      {cTot > 0 && (
                        <span className={`font-manrope text-[10px] ${cDone === cTot ? "text-green-400" : "text-white/30"}`}>
                          {cDone}/{cTot}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 pt-4 border-t border-white/8 space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <button
                    onClick={() => setShowDone(p => !p)}
                    className={`w-4 h-4 border rounded-sm flex items-center justify-center transition-colors ${
                      showDone ? "bg-primary border-primary" : "border-white/25 bg-transparent group-hover:border-primary/50"
                    }`}
                  >
                    {showDone && <Check className="w-2.5 h-2.5 text-black" />}
                  </button>
                  <span className="font-cinzel text-[8.5px] tracking-[0.15em] text-white/50 uppercase">Show completed</span>
                </label>
              </div>

              {pct === 100 && (
                <div className="mt-4 p-3 bg-green-500/8 border border-green-500/25 rounded-sm text-center">
                  <Trophy className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
                  <p className="font-cinzel text-[8px] tracking-[0.2em] text-green-400 uppercase">All done!</p>
                </div>
              )}
            </div>
          </aside>

          {/* Main task list */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-cormorant text-2xl text-white font-semibold">{activeCat}</h2>
                <p className="font-manrope text-xs text-white/35 mt-0.5">{visible.length} task{visible.length !== 1 ? "s" : ""} visible</p>
              </div>
              <button
                onClick={() => setShowAdd(p => !p)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> Add Task
              </button>
            </div>

            {/* Add task form */}
            <AnimatePresence>
              {showAdd && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden mb-5"
                >
                  <div className="bg-[#1a1510] border border-primary/25 p-5">
                    <p className="font-cinzel text-[9px] tracking-[0.25em] text-primary/75 uppercase mb-4">New Task</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Task title..."
                        value={newTitle}
                        onChange={e => setNewTitle(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && addTask()}
                        className="col-span-2 px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 placeholder:text-white/25"
                      />
                      <select
                        value={newCat}
                        onChange={e => setNewCat(e.target.value)}
                        className="px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 appearance-none"
                      >
                        {CATEGORIES.filter(c => c !== "All").map(c => (
                          <option key={c} value={c} className="bg-[#1a1510]">{c}</option>
                        ))}
                      </select>
                      <select
                        value={newPriority}
                        onChange={e => setNewPriority(e.target.value as Task["priority"])}
                        className="px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50 appearance-none"
                      >
                        <option value="high" className="bg-[#1a1510]">High Priority</option>
                        <option value="medium" className="bg-[#1a1510]">Medium Priority</option>
                        <option value="low" className="bg-[#1a1510]">Low Priority</option>
                      </select>
                      <input
                        type="date"
                        value={newDue}
                        onChange={e => setNewDue(e.target.value)}
                        className="px-3 py-2.5 bg-black/30 border border-white/10 text-white text-sm font-manrope focus:outline-none focus:border-primary/50"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={addTask} className="px-5 py-2 bg-primary text-black font-cinzel text-[9px] tracking-[0.18em] uppercase font-bold hover:bg-primary/90 transition-colors">
                        Add Task
                      </button>
                      <button onClick={() => setShowAdd(false)} className="px-4 py-2 border border-white/15 text-white/50 font-cinzel text-[9px] tracking-[0.15em] uppercase hover:border-white/35 hover:text-white/75 transition-all">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task list */}
            <div className="space-y-2">
              <AnimatePresence>
                {visible.map(task => {
                  const pm    = PRIORITY_META[task.priority];
                  const color = CAT_COLOR[task.category] ?? "#d4af37";
                  const isEditing = editingId === task.id;

                  return (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: task.done ? 0.55 : 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.22 }}
                      className={`bg-[#0f0c08] border rounded-sm p-4 flex items-start gap-3.5 group transition-all ${
                        task.done ? "border-white/5" : "border-white/8 hover:border-white/15"
                      }`}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => update(task.id, { done: !task.done })}
                        className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center transition-all"
                      >
                        {task.done
                          ? <CheckCircle2 className="w-5 h-5 text-primary" />
                          : <Circle className="w-5 h-5 text-white/25 group-hover:text-white/50 transition-colors" />
                        }
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <input
                              autoFocus
                              value={editTitle}
                              onChange={e => setEditTitle(e.target.value)}
                              onKeyDown={e => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null); }}
                              className="flex-1 px-2 py-1 bg-black/40 border border-primary/40 text-white text-sm font-manrope focus:outline-none"
                            />
                            <button onClick={() => saveEdit(task.id)} className="text-primary hover:text-primary/80 transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-white/30 hover:text-white/60 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <p className={`font-manrope text-sm leading-snug ${task.done ? "line-through text-white/30" : "text-white/85"}`}>
                            {task.title}
                          </p>
                        )}

                        <div className="flex items-center gap-2.5 mt-2 flex-wrap">
                          {activeCat === "All" && (
                            <span className="font-cinzel text-[7.5px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm border"
                              style={{ color, borderColor: `${color}40`, background: `${color}10` }}>
                              {task.category}
                            </span>
                          )}
                          <span className={`font-cinzel text-[7.5px] tracking-[0.12em] uppercase px-2 py-0.5 border rounded-sm ${pm.color}`}>
                            <Flag className="w-2.5 h-2.5 inline mr-1" />{pm.label}
                          </span>
                          {task.dueDate && (
                            <span className="flex items-center gap-1 font-manrope text-[10px] text-white/35">
                              <CalendarDays className="w-3 h-3" />
                              {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button onClick={() => startEdit(task)} className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-white/75 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeTask(task.id)} className="w-7 h-7 flex items-center justify-center text-white/35 hover:text-red-400 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {visible.length === 0 && (
                <div className="text-center py-20">
                  <CheckCircle2 className="w-10 h-10 text-white/10 mx-auto mb-4" />
                  <p className="font-cormorant text-xl text-white/40">No tasks here</p>
                  <p className="font-manrope text-sm text-white/25 mt-1">
                    {!showDone ? "All tasks in this category are complete!" : "Add a task to get started."}
                  </p>
                </div>
              )}
            </div>

            {/* Reset hint */}
            <div className="mt-8 text-center">
              <button
                onClick={() => { if (window.confirm("Reset all tasks to defaults?")) { setTasks(DEFAULT_TASKS.map(t => ({ ...t, id: uid() }))); setActiveCat("All"); } }}
                className="font-cinzel text-[8px] tracking-[0.2em] text-white/20 uppercase hover:text-white/45 transition-colors underline underline-offset-2"
              >
                Reset to default checklist
              </button>
            </div>
          </div>
        </div>

        {/* Sticky bottom progress bar on mobile */}
        <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-[#080604]/98 backdrop-blur-xl border-t border-white/8 px-5 py-3 z-30 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="font-cormorant text-lg font-semibold text-primary shrink-0">{pct}%</span>
          <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />
        </div>

      </main>
      <Footer />
    </div>
  );
}
