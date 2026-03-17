import { motion } from "framer-motion";
import { ArrowUpDown, MapPin, Zap, Shield, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const FILTERS = [
  { label: "Price", icon: ArrowUpDown },
  { label: "Distance", icon: MapPin },
  { label: "EV", icon: Zap },
  { label: "Secure", icon: Shield },
  { label: "More", icon: SlidersHorizontal },
];

interface FilterBarProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <motion.div
      className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.label;
        const Icon = filter.icon;
        return (
          <Button
            key={filter.label}
            variant={isActive ? "default" : "pill"}
            size="sm"
            onClick={() => onFilterChange(isActive ? null : filter.label)}
            className="shrink-0 gap-1.5"
          >
            <Icon className="w-3.5 h-3.5" />
            {filter.label}
          </Button>
        );
      })}
    </motion.div>
  );
}
