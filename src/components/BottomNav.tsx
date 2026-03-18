import { Home, Compass, PlusCircle, Bell, User } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "explore", label: "Explore", icon: Compass },
  { id: "list", label: "Host", icon: PlusCircle, center: true },
  { id: "activity", label: "Activity", icon: Bell },
  { id: "profile", label: "Profile", icon: User },
];

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      {/* Smooth SVG bump notch - overlaps border-t */}
      <svg
        className="absolute left-1/2 -translate-x-1/2 -top-[26px] z-20 drop-shadow-none"
        width="96"
        height="30"
        viewBox="0 0 96 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 30 C10 30 18 30 28 16 C34 7 38 0 48 0 C58 0 62 7 68 16 C78 30 86 30 96 30"
          className="fill-card stroke-border"
          strokeWidth="1"
        />
        {/* Cover the bottom stroke so it blends into the bar */}
        <rect x="0" y="28" width="96" height="4" className="fill-card" />
      </svg>

      {/* Nav bar */}
      <div className="relative z-10 bg-card border-t border-border px-2 pb-1 pt-1 safe-area-bottom">
        <div className="flex items-center justify-around">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            if (tab.center) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="relative flex flex-col items-center gap-0.5 py-1 px-4 min-w-[60px] -mt-8 z-20"
                >
                  <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{tab.label}</span>
                </button>
              );
            }

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
    </div>
  );
}