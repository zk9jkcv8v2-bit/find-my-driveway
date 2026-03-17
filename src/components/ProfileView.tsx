import { motion } from "framer-motion";
import { Star, Shield, Car, MapPin, ChevronRight } from "lucide-react";

const MENU_ITEMS = [
  { label: "Verification", icon: Shield, desc: "Identity verified ✓", color: "text-success" },
  { label: "My Vehicles", icon: Car, desc: "2 vehicles added" },
  { label: "Saved Spots", icon: MapPin, desc: "5 saved" },
  { label: "Ratings & Reviews", icon: Star, desc: "4.9 average" },
];

export default function ProfileView() {
  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <motion.div
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-display font-bold text-primary">
          JD
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">Jordan Doe</h1>
          <p className="text-sm text-muted-foreground">Member since 2024</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <motion.div className="glass-card p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="font-display font-bold text-2xl text-foreground">47</p>
          <p className="text-xs text-muted-foreground">Bookings</p>
        </motion.div>
        <motion.div className="glass-card p-4 text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="font-display font-bold text-2xl text-primary">4.9</p>
          <p className="text-xs text-muted-foreground">Rating</p>
        </motion.div>
      </div>

      <div className="space-y-2">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              className="glass-card p-4 w-full flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
            >
              <Icon className={`w-5 h-5 ${item.color || "text-muted-foreground"}`} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
