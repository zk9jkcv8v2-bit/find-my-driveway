import { MapPin, PlusCircle, BarChart3, User } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "discover", label: "Explore", icon: MapPin },
  { id: "list", label: "Host", icon: PlusCircle },
  { id: "earnings", label: "Earnings", icon: BarChart3 },
  { id: "profile", label: "Account", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border px-2 pb-1 pt-1 safe-area-bottom">
      <div className="flex items-center justify-around">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-0.5 py-2 px-4 min-w-[60px] transition-colors"
            >
              <div className={`relative p-1 rounded-full transition-colors ${isActive ? "bg-primary/10" : ""}`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
