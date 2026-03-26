import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, DollarSign, ArrowUpRight, ArrowLeft, Check, CreditCard, Clock, ChevronRight, Sparkles } from "lucide-react";
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

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 1200, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease-out cubic
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

/* ── Progress Ring ── */
function ProgressRing({ percent, size = 80, stroke = 6 }: { percent: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circumference - (percent / 100) * circumference);
    }, 400);
    return () => clearTimeout(timer);
  }, [percent, circumference]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--secondary))" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="url(#ringGradient)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-extrabold text-sm text-foreground">{percent}%</span>
      </div>
    </div>
  );
}

/* ── Confetti burst ── */
function ConfettiBurst() {
  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * 360;
    const distance = 40 + Math.random() * 30;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;
    const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--warning))", "hsl(var(--primary))"];
    return { x, y, color: colors[i % colors.length], size: 4 + Math.random() * 4, delay: Math.random() * 0.15 };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: p.color, left: "50%", top: "50%", marginLeft: -p.size / 2, marginTop: -p.size / 2 }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/* ── Bar chart tooltip ── */
function ChartBar({ day, amount, maxAmount, index, period }: { day: string; amount: number; maxAmount: number; index: number; period: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const barHeight = Math.round((amount / maxAmount) * 80);
  const isMax = amount === maxAmount;

  return (
    <div className="flex-1 flex flex-col items-center gap-1.5 relative">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute -top-8 bg-foreground text-background text-[10px] font-bold px-2 py-0.5 rounded-md z-10 whitespace-nowrap"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
          >
            ${amount}
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="flex-1 w-full flex items-end cursor-pointer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onTouchStart={() => setShowTooltip(true)}
        onTouchEnd={() => setTimeout(() => setShowTooltip(false), 1200)}
      >
        <motion.div
          className="w-full rounded-lg relative overflow-hidden"
          style={{
            background: isMax
              ? "linear-gradient(to top, hsl(var(--accent)), hsl(152 60% 58%))"
              : "hsl(var(--accent))",
            boxShadow: isMax ? "0 0 12px hsl(var(--accent) / 0.4)" : "none",
          }}
          initial={{ height: 0 }}
          animate={{ height: barHeight }}
          transition={{ delay: 0.1 + index * 0.04, type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
      <span className="text-[9px] text-muted-foreground font-medium">{day}</span>
    </div>
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

  if (subScreen === "withdraw") {
    return (
      <div className="h-screen bg-background pb-24 px-4 pt-14 overflow-y-auto">
        <button onClick={() => setSubScreen("main")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {withdrawn ? (
          <motion.div className="text-center py-20" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 12, delay: 0.1 }}
              >
                <Check className="w-8 h-8 text-accent" />
              </motion.div>
              {showConfetti && <ConfettiBurst />}
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-1">Withdrawal Sent!</h2>
            <p className="text-sm text-muted-foreground">$237.00 is on its way to your bank account.</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Withdraw Earnings</h1>
            <p className="text-muted-foreground text-sm mb-8">Transfer your balance to your bank account</p>

            <div className="soft-card p-5 mb-4">
              <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
              <p className="font-display font-extrabold text-4xl text-foreground">${totalWeek}.00</p>
            </div>

            <div className="soft-card p-4 mb-6 flex items-center gap-3">
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

            <Button
              variant="success"
              size="xl"
              className="w-full rounded-2xl font-display"
              onClick={handleWithdraw}
              disabled={withdrawing}
            >
              {withdrawing ? (
                <motion.span
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  />
                  Processing...
                </motion.span>
              ) : `Withdraw $${totalWeek}.00`}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

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
              whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
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

  return (
    <div className="h-screen bg-background pb-24 px-4 pt-14 overflow-y-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-extrabold text-2xl text-foreground mb-0.5">Earnings</h1>
        <p className="text-muted-foreground text-sm mb-6">Your parking income overview</p>
      </motion.div>

      {/* Revenue card */}
      <motion.div
        className="soft-card p-5 mb-4 soft-shadow"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex bg-secondary rounded-full p-0.5">
            <button
              onClick={() => setPeriod("week")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                period === "week" ? "bg-card text-foreground soft-shadow" : "text-muted-foreground"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                period === "month" ? "bg-card text-foreground soft-shadow" : "text-muted-foreground"
              }`}
            >
              Month
            </button>
          </div>
          <motion.div
            className="flex items-center gap-1 text-accent text-sm font-semibold bg-accent/10 px-2.5 py-1 rounded-full"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18%
          </motion.div>
        </div>

        <p className="font-display font-extrabold text-4xl text-foreground mb-1 tabular-nums">
          ${animatedTotal.toLocaleString()}
        </p>
        <p className="text-muted-foreground text-xs">
          {period === "week" ? "This week" : "This month"} revenue
        </p>

        {/* Chart inside gradient card */}
        <div className="flex items-end gap-[6px] h-20 mt-4">
          {earnings.map((day, i) => {
            const barHeight = Math.round((day.amount / maxAmount) * 64);
            const isMax = day.amount === maxAmount;
            return (
              <ChartBar key={`${period}-${day.day}`} day={day.day} amount={day.amount} maxAmount={maxAmount} index={i} period={period} />
            );
          })}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <motion.div
          className="soft-card p-4 cursor-pointer"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileTap={{ scale: 0.97 }}
        >
          <DollarSign className="w-5 h-5 text-accent mb-2" />
          <p className="font-display font-extrabold text-xl text-foreground tabular-nums">${animatedMonth.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </motion.div>
        <motion.div
          className="soft-card p-4 cursor-pointer"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
        >
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="font-display font-extrabold text-xl text-foreground tabular-nums">{animatedBookings}</p>
          <p className="text-xs text-muted-foreground">Bookings</p>
        </motion.div>
      </div>

      {/* Monthly goal progress */}
      <motion.div
        className="soft-card p-4 mb-6 flex items-center gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileTap={{ scale: 0.98 }}
      >
        <ProgressRing percent={78} />
        <div className="flex-1">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-warning" />
            <p className="font-display font-bold text-sm text-foreground">Monthly Goal</p>
          </div>
          <p className="text-xs text-muted-foreground mb-1">$1,842 of $2,400 target</p>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))" }}
              initial={{ width: 0 }}
              animate={{ width: "78%" }}
              transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Upcoming */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-base text-foreground">Upcoming Bookings</h2>
        <button onClick={() => setSubScreen("all-bookings")} className="text-xs text-primary font-semibold">View all</button>
      </div>
      <div className="space-y-2">
        {UPCOMING.slice(0, 2).map((booking, i) => (
          <motion.div
            key={booking.id}
            className="soft-card p-3.5 flex items-center gap-3"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            whileHover={{ y: -2, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
              {booking.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-foreground">{booking.driver}</p>
              <p className="text-xs text-muted-foreground">{booking.time} · {booking.duration}</p>
            </div>
            <span className="font-display font-bold text-accent">${booking.amount}</span>
          </motion.div>
        ))}
      </div>

      {/* Withdraw */}
      <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button
          variant="success"
          size="xl"
          className="w-full rounded-2xl font-display"
          onClick={() => setSubScreen("withdraw")}
        >
          Withdraw ${totalWeek}.00
        </Button>
      </motion.div>

      {/* Payment Method Card */}
      <motion.div
        className="mt-6 mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
      >
        <h2 className="font-display font-bold text-base text-foreground mb-3">Payment Method</h2>
        <motion.div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--foreground) / 0.8))",
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Card chip & contactless */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5">
              <div className="w-8 h-6 rounded-sm bg-warning/80" />
              <svg className="w-5 h-5 text-background/50 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8.5 16.5a5 5 0 0 1 0-9" /><path d="M12 16.5a5 5 0 0 0 0-9" />
              </svg>
            </div>
            <span className="text-background/60 text-xs font-semibold tracking-wider uppercase">Visa</span>
          </div>

          {/* Card number */}
          <p className="text-background font-mono text-base tracking-[0.2em] mb-4">
            •••• •••• •••• 4829
          </p>

          {/* Card details row */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-background/50 text-[9px] uppercase tracking-wider mb-0.5">Card Holder</p>
              <p className="text-background text-xs font-semibold">Jordan Mitchell</p>
            </div>
            <div>
              <p className="text-background/50 text-[9px] uppercase tracking-wider mb-0.5">Expires</p>
              <p className="text-background text-xs font-semibold">09/28</p>
            </div>
            <div>
              <p className="text-background/50 text-[9px] uppercase tracking-wider mb-0.5">Balance</p>
              <p className="text-background text-xs font-bold font-display">${animatedTotal > 0 ? animatedTotal.toLocaleString() : displayTotal.toLocaleString()}.00</p>
            </div>
          </div>

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: "radial-gradient(circle at 20% 80%, hsl(var(--background)) 1px, transparent 1px), radial-gradient(circle at 80% 20%, hsl(var(--background)) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
        </motion.div>

        {/* Quick actions under card */}
        <div className="grid grid-cols-3 gap-3 mt-3">
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
              whileTap={{ scale: 0.95 }}
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
