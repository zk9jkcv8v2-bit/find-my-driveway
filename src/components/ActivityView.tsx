import { Bell } from "lucide-react";

export default function ActivityView() {
  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Bell className="w-7 h-7 text-muted-foreground" />
      </div>
      <h2 className="font-display text-lg font-bold text-foreground mb-1">No activity yet</h2>
      <p className="text-sm text-muted-foreground max-w-[260px]">
        Your bookings, messages, and notifications will show up here.
      </p>
    </div>
  );
}
