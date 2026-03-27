import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, MessageSquare, Clock, Car, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const UPCOMING = [
  {
    title: "Downtown Garage",
    address: "123 Main St, Spot B4",
    time: "Tomorrow · 2:00 – 5:00 PM",
    price: "$3.15",
    status: "Confirmed",
    statusColor: "bg-accent text-accent-foreground",
  },
  {
    title: "Office Parking",
    address: "88 Commerce Blvd",
    time: "Today · Starts in 1 hour",
    price: "$2.50",
    status: "Upcoming",
    statusColor: "bg-primary text-primary-foreground",
  },
];

const NOTIFICATIONS = [
  {
    avatar: "https://i.pravatar.cc/40?img=47",
    initials: "SM",
    name: "Sarah M.",
    message: "Sure, the spot is still available!",
    time: "2h ago",
    unread: true,
  },
  {
    avatar: "https://i.pravatar.cc/40?img=12",
    initials: "JD",
    name: "James D.",
    message: "Thanks for booking, see you then!",
    time: "Yesterday",
    unread: false,
  },
];

const PAST = [
  {
    title: "Residential Driveway",
    time: "Mar 15 · 10:00 AM – 1:00 PM",
    price: "$1.75",
  },
  {
    title: "Shopping Center Lot",
    time: "Mar 12 · 9:00 AM – 12:00 PM",
    price: "$2.30",
  },
];

function ActivitySkeleton() {
  return (
    <div className="px-4 pt-14 pb-24 space-y-8">
      {/* Upcoming skeleton */}
      <div>
        <Skeleton className="h-3 w-20 mb-3" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="h-px bg-border" />
      {/* Messages skeleton */}
      <div>
        <Skeleton className="h-3 w-20 mb-3" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-px bg-border" />
      {/* Past skeleton */}
      <div>
        <Skeleton className="h-3 w-24 mb-3" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <Skeleton className="w-9 h-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ActivityView() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <ScrollArea className="h-full">
        <ActivitySkeleton />
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="px-4 pt-14 pb-24 space-y-8">

        {/* Upcoming */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Upcoming
          </h3>
          <div className="space-y-3">
            {UPCOMING.map((item, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden rounded-2xl bg-card border border-border p-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-[15px] font-bold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.address}</p>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs">{item.time}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Messages */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Messages
          </h3>
          <div className="space-y-2">
            {NOTIFICATIONS.map((n, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative">
                  <img src={n.avatar} alt={n.name} className="w-10 h-10 rounded-full object-cover bg-secondary" onError={(e) => { e.currentTarget.style.display = "none" }} />
                  {n.unread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{n.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{n.message}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Past */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Past Bookings
          </h3>
          <div className="space-y-2">
            {PAST.map((item, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <Car className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{item.price}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </ScrollArea>
  );
}
