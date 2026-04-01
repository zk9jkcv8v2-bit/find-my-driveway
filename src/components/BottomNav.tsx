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
  { id: "activity", icon: Bell, label: "Activity", badge: true },
  { id: "profile", icon: User, label: "Profile" },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav role="navigation" aria-label="Main navigation" className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.center) {
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              aria-label={tab.label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center gap-0.5 p-2 transition-colors relative focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
              whileTap={{ scale: 0.9 }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-destructive" />
                )}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
