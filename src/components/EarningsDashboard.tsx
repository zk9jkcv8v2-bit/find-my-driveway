import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, DollarSign, ArrowUpRight, ArrowLeft, Check, CreditCard, Clock, ChevronRight } from "lucide-react";
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

export default function EarningsDashboard() {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);

  const earnings = period === "week" ? MOCK_EARNINGS_WEEKLY : MOCK_EARNINGS_MONTHLY;
  const maxAmount = Math.max(...earnings.map((e) => e.amount));
  const totalWeek = 237;
  const totalMonth = 1842;
  const displayTotal = period === "week" ? totalWeek : totalMonth;

  const handleWithdraw = () => {
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      setWithdrawn(true);
      toast({ title: "Withdrawal initiated", description: `$${totalWeek}.00 will arrive in 1–2 business days.` });
      setTimeout(() => {
        setSubScreen("main");
        setWithdrawn(false);
      }, 2000);
    }, 1500);
  };

  if (subScreen === "withdraw") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <button onClick={() => setSubScreen("main")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {withdrawn ? (
          <motion.div className="text-center py-20" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-accent" />
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
              {withdrawing ? "Processing..." : `Withdraw $${totalWeek}.00`}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  if (subScreen === "all-bookings") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
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
              className="soft-card p-3.5 flex items-center gap-3"
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

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-14">
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
          {/* Period toggle */}
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
          <div className="flex items-center gap-1 text-accent text-sm font-semibold bg-accent/10 px-2.5 py-1 rounded-full">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18%
          </div>
        </div>

        <p className="font-display font-extrabold text-3xl text-foreground mb-4">${displayTotal}</p>

        {/* Chart */}
        <div className="flex items-end gap-[6px] h-20">
          {earnings.map((day, i) => (
            <motion.div
              key={`${period}-${day.day}`}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              style={{ transformOrigin: "bottom" }}
            >
              <div
                className="w-full rounded-lg bg-primary transition-all duration-300"
                style={{ height: `${(day.amount / maxAmount) * 100}%` }}
              />
              <span className="text-[9px] text-muted-foreground font-medium">{day.day}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div className="soft-card p-4" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <DollarSign className="w-5 h-5 text-accent mb-2" />
          <p className="font-display font-extrabold text-xl text-foreground">$1,842</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </motion.div>
        <motion.div className="soft-card p-4" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="font-display font-extrabold text-xl text-foreground">23</p>
          <p className="text-xs text-muted-foreground">Bookings</p>
        </motion.div>
      </div>

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
            transition={{ delay: 0.3 + i * 0.05 }}
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
    </div>
  );
}
