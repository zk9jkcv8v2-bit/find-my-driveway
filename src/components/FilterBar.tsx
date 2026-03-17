import { motion } from "framer-motion";
import { SlidersHorizontal, Clock, Zap, DollarSign, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const FILTERS = [
  { label: "Sort", icon: ArrowDownUp },
  { label: "Price", icon: DollarSign },
  { label: "EV", icon: Zap },
  { label: "Now", icon: Clock },
];

interface FilterBarProps {
  activeFilter: string | null;
  onFilterChange: (filter: string | null) => void;
}

export default function FilterBar({ activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <motion.div
      className="flex gap-2 px-4 overflow-x-auto no-scrollbar"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.label;
        const Icon = filter.icon;
        return (
          <Button
            key={filter.label}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(isActive ? null : filter.label)}
            className="shrink-0 gap-1.5 rounded-full h-8 px-3"
          >
            <Icon className="w-3.5 h-3.5" />
            {filter.label}
          </Button>
        );
      })}
    </motion.div>
  );
}
