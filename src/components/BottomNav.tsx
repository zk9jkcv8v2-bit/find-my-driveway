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
      {/* Single integrated SVG background with bump */}
      <div className="relative">
        {/* SVG shell: draws the entire top contour including the bump */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 390 86"
          preserveAspectRatio="none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 
            Path: starts top-left, goes right to the bump area, 
            curves up for the bump, comes back down, continues right,
            then down and around the bottom.
            Bump center at x=195, bump rises ~30px above the bar top (y=30 is bar top, bump peak at y=0)
          */}
          <path
            d="
              M0 30
              L130 30
              C145 30, 155 30, 165 18
              C172 8, 180 0, 195 0
              C210 0, 218 8, 225 18
              C235 30, 245 30, 260 30
              L390 30
              L390 86
              L0 86
              Z
            "
            className="fill-card"
          />
          {/* Border stroke along the top contour only */}
          <path
            d="
              M0 30
              L130 30
              C145 30, 155 30, 165 18
              C172 8, 180 0, 195 0
              C210 0, 218 8, 225 18
              C235 30, 245 30, 260 30
              L390 30
            "
            className="stroke-border"
            strokeWidth="1"
            fill="none"
          />
        </svg>

        {/* Nav content sits on top of SVG */}
        <div className="relative z-10 pt-[30px] pb-1 px-2 safe-area-bottom" style={{ height: 86 }}>
          <div className="flex items-end justify-around h-full">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              if (tab.center) {
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative flex flex-col items-center gap-0.5 min-w-[60px] -mt-[30px] z-20"
                    style={{ marginTop: -26 }}
                  >
                    <div className="w-[52px] h-[52px] rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30">
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
                  className="relative flex flex-col items-center gap-0.5 pb-1 px-3 min-w-[56px] transition-colors"
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
    </div>
  );
}
