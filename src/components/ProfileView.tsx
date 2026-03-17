import { motion } from "framer-motion";
import { Star, Shield, Car, MapPin, ChevronRight, Bell, HelpCircle, LogOut } from "lucide-react";

const MENU_ITEMS = [
  { label: "Verification", icon: Shield, desc: "Identity verified", color: "text-accent" },
  { label: "My Vehicles", icon: Car, desc: "2 vehicles added", color: "text-primary" },
  { label: "Saved Spots", icon: MapPin, desc: "5 saved", color: "text-primary" },
  { label: "Notifications", icon: Bell, desc: "All enabled", color: "text-primary" },
  { label: "Help & Support", icon: HelpCircle, desc: "FAQ, disputes", color: "text-muted-foreground" },
];

export default function ProfileView() {
  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-14">
      {/* Profile header */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-display font-extrabold text-primary">
          JD
        </div>
        <div>
          <h1 className="font-display font-extrabold text-xl text-foreground">Jordan Doe</h1>
          <p className="text-sm text-muted-foreground">Member since 2024</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="soft-card p-3 text-center">
          <p className="font-display font-extrabold text-lg text-foreground">47</p>
          <p className="text-[10px] text-muted-foreground">Bookings</p>
        </div>
        <div className="soft-card p-3 text-center">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <p className="font-display font-extrabold text-lg text-foreground">4.9</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Rating</p>
        </div>
        <div className="soft-card p-3 text-center">
          <p className="font-display font-extrabold text-lg text-accent">✓</p>
          <p className="text-[10px] text-muted-foreground">Verified</p>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-1.5">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              className="soft-card p-4 w-full flex items-center gap-3 hover:bg-secondary/50 transition-colors"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
            >
              <div className={`w-9 h-9 rounded-xl bg-secondary flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${item.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>

      {/* Sign out */}
      <motion.button
        className="flex items-center gap-2 mt-8 mx-auto text-sm text-muted-foreground hover:text-destructive transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  );
}
