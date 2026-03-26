import { motion } from "framer-motion";
import { Home, Compass, PlusCircle, Bell, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", icon: Home, label: "Home" },
  { id: "explore", icon: Compass, label: "Explore" },
  { id: "list", icon: PlusCircle, center: true, label: "List" },
  { id: "activity", icon: Bell, label: "Activity" },
  { id: "profile", icon: User, label: "Profile" },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.center) {
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 relative -top-3"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon className="w-6 h-6" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center gap-0.5 p-2 transition-colors relative"
              whileTap={{ scale: 0.9 }}
            >
              <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  layoutId="navIndicator"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
