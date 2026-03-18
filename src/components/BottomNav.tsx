import { Home, Compass, PlusCircle, Bell, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", icon: Home },
  { id: "explore", icon: Compass },
  { id: "list", icon: PlusCircle, center: true },
  { id: "activity", icon: Bell },
  { id: "profile", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-14 px-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.center) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25"
              >
                <Icon className="w-6 h-6" />
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="p-2 transition-colors"
            >
              <Icon className={`w-6 h-6 transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
