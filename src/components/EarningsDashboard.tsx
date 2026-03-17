import { motion } from "framer-motion";
import { TrendingUp, Calendar, DollarSign, ArrowUpRight } from "lucide-react";
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
  { time: "Today, 2:00 PM", duration: "3h", amount: 24, driver: "Alex M." },
  { time: "Tomorrow, 9:00 AM", duration: "8h", amount: 40, driver: "Sarah K." },
  { time: "Sat, 6:00 PM", duration: "4h", amount: 48, driver: "Mike R." },
];

const maxAmount = Math.max(...MOCK_EARNINGS.map(e => e.amount));

export default function EarningsDashboard() {
  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">Earnings</h1>
        <p className="text-muted-foreground text-sm mb-6">This week's overview</p>
      </motion.div>

      {/* Revenue card */}
      <motion.div
        className="glass-card p-5 mb-4 glow-primary"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
            <p className="font-display font-bold text-3xl text-foreground">$237.00</p>
          </div>
          <div className="flex items-center gap-1 text-primary text-sm font-medium">
            <ArrowUpRight className="w-4 h-4" />
            +18%
          </div>
        </div>

        {/* Chart */}
        <div className="flex items-end gap-2 h-24">
          {MOCK_EARNINGS.map((day, i) => (
            <motion.div
              key={day.day}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              style={{ transformOrigin: "bottom" }}
            >
              <div
                className="w-full rounded-md bg-primary/80"
                style={{ height: `${(day.amount / maxAmount) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{day.day}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div className="glass-card p-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <DollarSign className="w-5 h-5 text-accent mb-2" />
          <p className="font-display font-bold text-xl text-foreground">$1,842</p>
          <p className="text-xs text-muted-foreground">This month</p>
        </motion.div>
        <motion.div className="glass-card p-4" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
          <Calendar className="w-5 h-5 text-primary mb-2" />
          <p className="font-display font-bold text-xl text-foreground">23</p>
          <p className="text-xs text-muted-foreground">Bookings</p>
        </motion.div>
      </div>

      {/* Upcoming bookings */}
      <h2 className="font-display font-semibold text-lg text-foreground mb-3">Upcoming</h2>
      <div className="space-y-3">
        {UPCOMING.map((booking, i) => (
          <motion.div
            key={i}
            className="glass-card p-4 flex items-center justify-between"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
          >
            <div>
              <p className="font-medium text-sm text-foreground">{booking.driver}</p>
              <p className="text-xs text-muted-foreground">{booking.time} · {booking.duration}</p>
            </div>
            <span className="font-display font-bold text-primary">${booking.amount}</span>
          </motion.div>
        ))}
      </div>

      {/* Withdraw */}
      <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <Button variant="glow" className="w-full h-12 rounded-xl font-display font-semibold text-base">
          Withdraw $237.00
        </Button>
      </motion.div>
    </div>
  );
}
