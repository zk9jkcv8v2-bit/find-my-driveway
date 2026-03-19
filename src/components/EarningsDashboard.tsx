import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, Calendar, DollarSign, ArrowUpRight, ArrowLeft,
  Check, CreditCard, Clock, ChevronRight, Sparkles, Flame, Star, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const MOCK_EARNINGS_WEEKLY = [
  { day: "Mon", amount: 24 },
  { day: "Tue", amount: 18 },
  { day: "Wed", amount: 32 },
  { day: "Thu", amount: 28 },
  { day: "Fri", amount: 45 },
  { day: "Sat", amount: 52 },
  { day: "Sun", amount: 38 },
];

const MOCK_EARNINGS_MONTHLY = [
  { day: "Wk1", amount: 180 },
  { day: "Wk2", amount: 220 },
  { day: "Wk3", amount: 310 },
  { day: "Wk4", amount: 290 },
];

const UPCOMING = [
  { id: 1, time: "Today, 2:00 PM", duration: "3h", amount: 24, driver: "Alex M.", avatar: "AM", status: "confirmed" },
  { id: 2, time: "Tomorrow, 9:00 AM", duration: "8h", amount: 40, driver: "Sarah K.", avatar: "SK", status: "confirmed" },
  { id: 3, time: "Sat, 6:00 PM", duration: "4h", amount: 48, driver: "Mike R.", avatar: "MR", status: "pending" },
];

const PAST = [
  { id: 4, time: "Last Mon, 10:00 AM", duration: "2h", amount: 16, driver: "Lisa T.", avatar: "LT", status: "completed" },
  { id: 5, time: "Last Sun, 3:00 PM", duration: "5h", amount: 30, driver: "James W.", avatar: "JW", status: "completed" },
];

type SubScreen = "main" | "all-bookings" | "withdraw";

/* ── Animated counter ── */
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

/* ── Confetti burst ── */
function ConfettiBurst() {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const angle = (i / 20) * 360;
    const distance = 50 + Math.random() * 40;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "#fff"];
    return { x, y, color: colors[i % colors.length], size: 3 + Math.random() * 5, delay: Math.random() * 0.2 };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, left: "50%", top: "50%", marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
          transition={{ duration: 0.8, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ── Animated bar ── */
function ChartBar({ day, amount, maxAmount, index }: { day: string; amount: number; maxAmount: number; index: number }) {
  const [touched, setTouched] = useState(false);
  const barHeight = Math.round((amount / maxAmount) * 72);
  const isMax = amount === maxAmount;

  return (
    <div className="flex-1 flex flex-col items-center gap-1 relative">
      <AnimatePresence>
        {touched && (
          <motion.div
            className="absolute -top-9 bg-foreground text-background text-[10px] font-bold px-2.5 py-1 rounded-lg z-10 whitespace-nowrap"
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            ${amount}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-foreground rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="flex-1 w-full flex items-end cursor-pointer"
        onMouseEnter={() => setTouched(true)}
        onMouseLeave={() => setTouched(false)}
        onTouchStart={() => setTouched(true)}
        onTouchEnd={() => setTimeout(() => setTouched(false), 1500)}
      >
        <motion.div
          className="w-full rounded-lg overflow-hidden"
          style={{
            background: isMax
              ? "linear-gradient(to top, hsl(var(--primary)), hsl(var(--accent)))"
              : "hsl(var(--primary) / 0.2)",
          }}
          initial={{ height: 0 }}
          animate={{ height: barHeight }}
          transition={{ delay: 0.15 + index * 0.06, type: "spring", stiffness: 200, damping: 20 }}
          whileTap={{ scale: 0.92 }}
        >
          {isMax && (
            <motion.div
              className="w-full h-full"
              style={{ background: "linear-gradient(to top, transparent, hsl(var(--primary-foreground) / 0.15))" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 1, duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </motion.div>
      </div>
      <span className={`text-[9px] font-semibold ${isMax ? "text-primary" : "text-muted-foreground"}`}>{day}</span>
    </div>
  );
}

/* ── Streak badge ── */
function StreakBadge() {
  return (
    <motion.div
      className="flex items-center gap-1.5 bg-warning/10 text-warning px-3 py-1.5 rounded-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, type: "spring" }}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatDelay: 4 }}
      >
        <Flame className="w-3.5 h-3.5" />
      </motion.div>
      <span className="text-[11px] font-bold">7-day streak!</span>
    </motion.div>
  );
}

export default function EarningsDashboard() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const earnings = period === "week" ? MOCK_EARNINGS_WEEKLY : MOCK_EARNINGS_MONTHLY;
  const maxAmount = Math.max(...earnings.map((e) => e.amount));
  const totalWeek = 237;
  const totalMonth = 1842;
  const displayTotal = period === "week" ? totalWeek : totalMonth;

  const animatedTotal = useCountUp(displayTotal, 1400, 200);
  const animatedMonth = useCountUp(1842, 1200, 300);
  const animatedBookings = useCountUp(23, 800, 400);

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawn(true);
      setShowConfetti(true);
      toast({ title: "Withdrawal initiated", description: `$${totalWeek}.00 will arrive in 1–2 business days.` });
      setTimeout(() => {
        setSubScreen("main");
        setWithdrawn(false);
        setShowConfetti(false);
      }, 2500);
    }, 1500);
  };

  /* ── Withdraw sub-screen ── */
  if (subScreen === "withdraw") {
    return (
      <div className="h-screen bg-background pb-24 px-4 pt-14 overflow-y-auto">
        <button onClick={() => setSubScreen("main")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {withdrawn ? (
          <motion.div className="text-center py-20" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5 relative">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}>
                <Check className="w-10 h-10 text-accent" />
              </motion.div>
              {showConfetti && <ConfettiBurst />}
            </div>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">Withdrawal Sent!</h2>
            <p className="text-sm text-muted-foreground">$237.00 is on its way to your bank account.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Withdraw Earnings</h1>
            <p className="text-muted-foreground text-sm mb-8">Transfer your balance to your bank account</p>

            <div className="soft-card p-6 mb-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Available Balance</p>
              <p className="font-display font-extrabold text-5xl text-foreground">${totalWeek}<span className="text-2xl text-muted-foreground">.00</span></p>
            </div>

            <div className="soft-card p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Chase •••• 4829</p>
                <p className="text-xs text-muted-foreground">Checking account</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>

            <div className="soft-card p-4 mb-6 flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Arrives in 1–2 business days</p>
            </div>

            <Button variant="success" size="xl" className="w-full rounded-2xl font-display" onClick={handleWithdraw} disabled={withdrawing}>
              {withdrawing ? (
                <motion.span className="flex items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <motion.div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} />
                  Processing...
                </motion.span>
              ) : `Withdraw $${totalWeek}.00`}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  /* ── All bookings sub-screen ── */
  if (subScreen === "all-bookings") {
    return (
      <div className="h-screen bg-background pb-24 px-4 pt-14 overflow-y-auto">
        <button onClick={() => setSubScreen("main")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">All Bookings</h1>
          <p className="text-muted-foreground text-sm mb-6">Manage your upcoming and past bookings</p>
        </motion.div>

        <h3 className="font-display font-bold text-sm text-foreground mb-3">Upcoming</h3>
        <div className="space-y-2 mb-6">
          {UPCOMING.map((booking, i) => (
            <motion.div
              key={booking.id}
              className="soft-card p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {booking.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{booking.driver}</p>
                <p className="text-xs text-muted-foreground">{booking.time} · {booking.duration}</p>
              </div>
              <div className="text-right">
                <span className="font-display font-bold text-accent">${booking.amount}</span>
                <p className={`text-[10px] font-medium ${booking.status === "pending" ? "text-warning" : "text-accent"}`}>
                  {booking.status === "pending" ? "Pending" : "Confirmed"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <h3 className="font-display font-bold text-sm text-foreground mb-3">Past</h3>
        <div className="space-y-2">
          {PAST.map((booking, i) => (
            <motion.div
              key={booking.id}
              className="soft-card p-3.5 flex items-center gap-3 opacity-70"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                {booking.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{booking.driver}</p>
                <p className="text-xs text-muted-foreground">{booking.time} · {booking.duration}</p>
              </div>
              <span className="font-display font-bold text-foreground">${booking.amount}</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  /* ── Main dashboard ── */
  return (
    <div className="h-screen bg-background pb-24 px-4 pt-14 overflow-y-auto no-scrollbar">
      {/* Header with streak */}
      <motion.div
        className="flex items-start justify-between mb-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-0.5">Earnings</h1>
          <p className="text-muted-foreground text-sm">Your parking income</p>
        </div>
        <StreakBadge />
      </motion.div>

      {/* ── Hero earnings card ── */}
      <motion.div
        className="rounded-3xl p-5 mb-4 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.85), hsl(var(--accent)))",
        }}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary-foreground/10" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-primary-foreground/5" />

        {/* Period toggle */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex bg-primary-foreground/15 backdrop-blur-sm rounded-full p-0.5">
            {(["week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all capitalize ${
                  period === p
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : "text-primary-foreground/70 hover:text-primary-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <motion.div
            className="flex items-center gap-1 text-primary-foreground/90 text-xs font-semibold bg-primary-foreground/15 backdrop-blur-sm px-2.5 py-1 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18%
          </motion.div>
        </div>

        {/* Total */}
        <div className="relative z-10 mb-1">
          <p className="text-primary-foreground/60 text-xs font-medium mb-1">
            {period === "week" ? "This Week" : "This Month"}
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-primary-foreground/60 font-display text-2xl font-bold">$</span>
            <motion.span
              key={period}
              className="font-display font-extrabold text-[42px] leading-none text-primary-foreground tabular-nums tracking-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {animatedTotal.toLocaleString()}
            </motion.span>
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end gap-[5px] h-[76px] mt-3 relative z-10">
          {earnings.map((day, i) => (
            <ChartBar key={`${period}-${day.day}`} day={day.day} amount={day.amount} maxAmount={maxAmount} index={i} />
          ))}
        </div>
      </motion.div>

      {/* ── Stats row ── */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { icon: DollarSign, value: `$${animatedMonth.toLocaleString()}`, label: "This month", color: "text-accent", bg: "bg-accent/10", delay: 0.2 },
          { icon: Calendar, value: animatedBookings.toString(), label: "Bookings", color: "text-primary", bg: "bg-primary/10", delay: 0.25 },
          { icon: Star, value: "4.9", label: "Rating", color: "text-warning", bg: "bg-warning/10", delay: 0.3 },
        ].map((stat) => (
          <motion.div
            key={stat.label}
            className="soft-card p-3.5 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            whileTap={{ scale: 0.96 }}
          >
            <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className="font-display font-extrabold text-base text-foreground tabular-nums">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Monthly goal ── */}
      <motion.div
        className="soft-card p-4 mb-5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-warning/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-foreground">Monthly Goal</p>
              <p className="text-[11px] text-muted-foreground">$558 left to go</p>
            </div>
          </div>
          <span className="font-display font-extrabold text-lg text-primary">78%</span>
        </div>
        <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
            initial={{ width: 0 }}
            animate={{ width: "78%" }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* shimmer */}
            <motion.div
              className="absolute inset-0"
              style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary-foreground) / 0.3) 50%, transparent 100%)" }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, delay: 1.8, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-muted-foreground">$1,842</span>
          <span className="text-[10px] text-muted-foreground">$2,400</span>
        </div>
      </motion.div>

      {/* ── Upcoming bookings ── */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-base text-foreground">Upcoming</h2>
        <button onClick={() => setSubScreen("all-bookings")} className="text-xs text-primary font-semibold">View all</button>
      </div>
      <div className="space-y-2 mb-5">
        {UPCOMING.slice(0, 2).map((booking, i) => (
          <motion.div
            key={booking.id}
            className="soft-card p-3.5 flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {booking.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{booking.driver}</p>
              <p className="text-xs text-muted-foreground">{booking.time} · {booking.duration}</p>
            </div>
            <div className="text-right">
              <span className="font-display font-bold text-accent">${booking.amount}</span>
              <p className={`text-[10px] font-medium ${booking.status === "pending" ? "text-warning" : "text-accent"}`}>
                {booking.status === "pending" ? "Pending" : "Confirmed"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Withdraw CTA ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Button
          variant="success"
          size="xl"
          className="w-full rounded-2xl font-display relative overflow-hidden group"
          onClick={() => setSubScreen("withdraw")}
        >
          <motion.div
            className="absolute inset-0 bg-primary-foreground/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center gap-2">
            Withdraw ${totalWeek}.00
            <ArrowUpRight className="w-4 h-4 transition-transform group-active:translate-x-0.5 group-active:-translate-y-0.5" />
          </span>
        </Button>
      </motion.div>

      {/* ── Payment card ── */}
      <motion.div className="mt-6 mb-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
        <h2 className="font-display font-bold text-base text-foreground mb-3">Payment Method</h2>
        <motion.div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--foreground) / 0.75))" }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              <div className="w-8 h-6 rounded-sm bg-warning/80" />
              <svg className="w-5 h-5 text-background/50 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" /><path d="M12 16.5a5 5 0 0 0 0-9" />
              </svg>
            </div>
            <span className="text-background/60 text-xs font-semibold tracking-wider uppercase">Visa</span>
          </div>
          <p className="text-background font-mono text-base tracking-[0.2em] mb-4">•••• •••• •••• 4829</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-background/50 text-[9px] uppercase tracking-wider mb-0.5">Card Holder</p>
              <p className="text-background text-xs font-semibold">Jordan Mitchell</p>
            </div>
            <div>
              <p className="text-background/50 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
              <p className="text-background text-xs font-semibold">09/28</p>
            </div>
          </div>
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, hsl(var(--background)) 1px, transparent 1px), radial-gradient(circle at 80% 20%, hsl(var(--background)) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </motion.div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { icon: <CreditCard className="w-4 h-4" />, label: "Change Card" },
            { icon: <Clock className="w-4 h-4" />, label: "History" },
            { icon: <TrendingUp className="w-4 h-4" />, label: "Insights" },
          ].map((action, i) => (
            <motion.button
              key={action.label}
              className="soft-card p-3 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.05 }}
              whileTap={{ scale: 0.93 }}
            >
              {action.icon}
              <span className="text-[10px] font-medium">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
