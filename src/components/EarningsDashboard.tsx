import { motion } from "framer-motion";
import { TrendingUp, Calendar, DollarSign, ArrowUpRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MOCK_EARNINGS = [
  { day: "Mon", amount: 24 },
  { day: "Tue", amount: 18 },
  { day: "Wed", amount: 32 },
  { day: "Thu", amount: 28 },
  { day: "Fri", amount: 45 },
  { day: "Sat", amount: 52 },
  { day: "Sun", amount: 38 },
];

const UPCOMING = [
  { time: "Today, 2:00 PM", duration: "3h", amount: 24, driver: "Alex M.", avatar: "AM" },
  { time: "Tomorrow, 9:00 AM", duration: "8h", amount: 40, driver: "Sarah K.", avatar: "SK" },
  { time: "Sat, 6:00 PM", duration: "4h", amount: 48, driver: "Mike R.", avatar: "MR" },
];

const maxAmount = Math.max(...MOCK_EARNINGS.map(e => e.amount));

export default function EarningsDashboard() {
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
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-muted-foreground mb-1">This Week</p>
            <p className="font-display font-extrabold text-3xl text-foreground">$237</p>
          </div>
          <div className="flex items-center gap-1 text-accent text-sm font-semibold bg-accent/10 px-2.5 py-1 rounded-full">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +18%
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end gap-[6px] h-20">
          {MOCK_EARNINGS.map((day, i) => (
            <motion.div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              style={{ transformOrigin: "bottom" }}
            >
              <div
                className="w-full rounded-lg bg-primary/20"
                style={{ height: `${(day.amount / maxAmount) * 100}%` }}
              >
                <div
                  className="w-full rounded-lg bg-primary"
                  style={{ height: "100%" }}
                />
              </div>
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
        <button className="text-xs text-primary font-semibold">View all</button>
      </div>
      <div className="space-y-2">
        {UPCOMING.map((booking, i) => (
          <motion.div
            key={i}
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
        <Button variant="success" size="xl" className="w-full rounded-2xl font-display">
          Withdraw $237.00
        </Button>
      </motion.div>
    </div>
  );
}
