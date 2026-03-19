import { CalendarCheck, MessageSquare, Clock, Car } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const ACTIVITIES = [
  {
    section: "Upcoming",
    items: [
      {
        icon: CalendarCheck,
        title: "Downtown Garage",
        subtitle: "Tomorrow, 2:00 PM – 5:00 PM",
        time: "In 18 hours",
        badge: "Confirmed",
        badgeVariant: "default" as const,
      },
      {
        icon: Clock,
        title: "Office Parking",
        subtitle: "Your booking starts in 1 hour",
        time: "Reminder",
        badge: null,
        badgeVariant: "default" as const,
      },
    ],
  },
  {
    section: "Recent",
    items: [
      {
        icon: MessageSquare,
        title: "Sarah M. replied to your message",
        subtitle: '"Sure, the spot is still available!"',
        time: "2h ago",
        badge: null,
        badgeVariant: "default" as const,
      },
      {
        icon: Car,
        title: "Residential Driveway",
        subtitle: "Mar 15, 10:00 AM – 1:00 PM",
        time: "4 days ago",
        badge: "Completed",
        badgeVariant: "secondary" as const,
      },
      {
        icon: CalendarCheck,
        title: "Shopping Center Lot",
        subtitle: "Mar 12, 9:00 AM – 12:00 PM",
        time: "1 week ago",
        badge: "Completed",
        badgeVariant: "secondary" as const,
      },
    ],
  },
];

export default function ActivityView() {
  return (
    <ScrollArea className="h-full">
      <div className="px-4 pt-2 pb-24 space-y-6">
        {ACTIVITIES.map((group) => (
          <div key={group.section}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group.section}
            </h3>
            <div className="space-y-2">
              {group.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-card border border-border"
                >
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                      {item.badge && (
                        <Badge variant={item.badgeVariant} className="text-[10px] shrink-0">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.subtitle}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
