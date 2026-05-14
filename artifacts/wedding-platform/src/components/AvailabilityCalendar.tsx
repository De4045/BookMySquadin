import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toYMD(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplay(ymd: string) {
  const d = new Date(ymd + "T12:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

interface Props {
  venueName: string;
  value: string;
  onChange: (date: string) => void;
}

export function AvailabilityCalendar({ venueName, value, onChange }: Props) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const todayYMD = toYMD(now.getFullYear(), now.getMonth(), now.getDate());

  /* Fetch booked dates whenever venueName changes */
  useEffect(() => {
    if (!venueName) return;
    setLoading(true);
    setError(false);
    fetch(`${BASE}/api/venues/availability?venueName=${encodeURIComponent(venueName)}`, {
      credentials: "include",
    })
      .then(r => r.ok ? r.json() as Promise<{ bookedDates: string[] }> : Promise.resolve({ bookedDates: [] }))
      .then(data => setBookedDates(new Set(data.bookedDates)))
      .catch(() => { setError(true); setBookedDates(new Set()); })
      .finally(() => setLoading(false));
  }, [venueName]);

  /* Calendar grid */
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  /* Today is the minimum selectable date */
  const canGoPrev = !(viewYear === now.getFullYear() && viewMonth === now.getMonth());

  const selectedIsBooked = value ? bookedDates.has(value) : false;

  return (
    <div className="space-y-2">

      {/* Calendar box */}
      <div
        className="overflow-hidden border border-white/12"
        style={{ background: "linear-gradient(145deg, #0d0a07 0%, #0a0805 100%)" }}
      >
        {/* Month navigation header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/8"
          style={{ background: "rgba(212,175,55,0.03)" }}>
          <button
            type="button"
            onClick={prevMonth}
            disabled={!canGoPrev}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-white/30 hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            {loading && <Loader2 className="w-3 h-3 text-primary/50 animate-spin shrink-0" />}
            <span className="font-cinzel text-[11px] tracking-[0.25em] text-white/75 uppercase select-none">
              {MONTHS[viewMonth]} {viewYear}
            </span>
          </div>

          <button
            type="button"
            onClick={nextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-sm text-white/30 hover:text-primary hover:bg-primary/10 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day-of-week labels */}
        <div className="grid grid-cols-7 border-b border-white/6">
          {DAYS.map(d => (
            <div key={d} className="py-2 text-center font-cinzel text-[8px] tracking-[0.2em] text-white/22 uppercase select-none">
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div className="grid grid-cols-7">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={idx} className="aspect-square" />;
            }

            const ymd = toYMD(viewYear, viewMonth, day);
            const isPast = ymd < todayYMD;
            const isBooked = bookedDates.has(ymd);
            const isSelected = ymd === value;
            const isToday = ymd === todayYMD;

            /* Determine visual state */
            let bg = "";
            let textColor = "text-white/60";
            let cursor = "cursor-pointer";
            let hoverBg = "hover:bg-primary/10 hover:text-primary";

            if (isSelected) {
              bg = "bg-primary";
              textColor = "text-black font-bold";
              hoverBg = "";
            } else if (isPast) {
              textColor = "text-white/15";
              cursor = "cursor-not-allowed";
              hoverBg = "";
            } else if (isBooked) {
              bg = "bg-red-500/10";
              textColor = "text-red-400/75";
              hoverBg = "hover:bg-red-500/18 hover:text-red-300";
            } else if (isToday) {
              textColor = "text-primary font-semibold";
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={isPast}
                onClick={() => onChange(ymd)}
                title={
                  isBooked && !isSelected ? "High enquiry demand on this date"
                  : isToday ? "Today"
                  : undefined
                }
                className={`
                  aspect-square flex items-center justify-center relative
                  font-manrope text-sm transition-all duration-150
                  ${bg} ${textColor} ${cursor} ${hoverBg}
                `}
              >
                <span className="relative z-10 select-none">{day}</span>

                {/* Today ring */}
                {isToday && !isSelected && (
                  <span className="absolute inset-[3px] border border-primary/40 rounded-sm pointer-events-none" />
                )}

                {/* Booked dot indicator */}
                {isBooked && !isSelected && (
                  <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400/70" />
                )}

                {/* Selected check mark on large devices */}
                {isSelected && (
                  <span className="absolute top-[3px] right-[3px] w-2 h-2 rounded-full bg-black/20" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5 px-4 py-2.5 border-t border-white/6"
          style={{ background: "rgba(212,175,55,0.02)" }}>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-primary inline-block shrink-0" />
            <span className="font-manrope text-[10px] text-white/35">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm bg-red-500/18 border border-red-400/25 inline-block shrink-0" />
            <span className="font-manrope text-[10px] text-white/35">High Demand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-sm border border-primary/40 inline-block shrink-0" />
            <span className="font-manrope text-[10px] text-white/35">Today</span>
          </div>
        </div>
      </div>

      {/* Fetch error notice */}
      {error && (
        <p className="font-manrope text-[11px] text-yellow-400/60 flex items-center gap-1.5">
          <AlertTriangle className="w-3 h-3 shrink-0" />
          Availability data unavailable — you can still submit your preferred date.
        </p>
      )}

      {/* Selected date pill */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className={`flex items-start gap-3 px-3.5 py-2.5 border ${
              selectedIsBooked
                ? "bg-red-500/6 border-red-400/20"
                : "bg-primary/6 border-primary/20"
            }`}
          >
            {selectedIsBooked
              ? <AlertTriangle className="w-3.5 h-3.5 text-red-400/60 shrink-0 mt-0.5" />
              : <CheckCircle2 className="w-3.5 h-3.5 text-primary/60 shrink-0 mt-0.5" />
            }
            <div>
              <p className={`font-manrope text-sm leading-snug ${selectedIsBooked ? "text-red-400/80" : "text-primary/80"}`}>
                {formatDisplay(value)}
              </p>
              {selectedIsBooked && (
                <p className="font-manrope text-[10px] text-red-400/55 mt-0.5 leading-snug">
                  High demand on this date — our team will confirm availability with you.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
