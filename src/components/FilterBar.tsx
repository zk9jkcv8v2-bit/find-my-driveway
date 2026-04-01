import { motion } from "framer-motion";
import { ArrowDownUp, DollarSign, Zap, MapPin } from "lucide-react";

const FILTERS = [
  { label: "Nearest", icon: MapPin },
  { label: "Cheapest", icon: DollarSign },
  { label: "EV", icon: Zap },
  { label: "Garage", icon: ArrowDownUp },
];

interface FilterBarProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <motion.div
      className="flex gap-2 px-4 overflow-x-auto no-scrollbar justify-center"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.label;
        const Icon = filter.icon;
        return (
          <motion.button
            key={filter.label}
            onClick={() => onFilterChange(isActive ? null : filter.label)}
            aria-label={`Filter by ${filter.label}`}
            aria-pressed={isActive}
            className={`shrink-0 gap-1.5 rounded-full h-9 px-3 text-sm font-medium inline-flex items-center border transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 ${
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-secondary"
            }`}
            whileTap={{ scale: 0.92 }}
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Icon className="w-3.5 h-3.5" />
            {filter.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
