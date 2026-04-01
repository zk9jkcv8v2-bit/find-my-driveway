import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Info, ChevronDown } from "lucide-react";
import type { SpotMarker } from "./spots-data";

interface ParkingSessionSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
}

export default function ParkingSessionSheet({ spot, onClose }: ParkingSessionSheetProps) {
  const [endHour, setEndHour] = useState(0);
  const [endMinute, setEndMinute] = useState(0);
  const [totalSlots] = useState(24);
  const [currentSlot, setCurrentSlot] = useState(12);
  const tickInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize with current time + 2 hours
  useEffect(() => {
    const now = new Date();
    const end = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    setEndHour(end.getHours());
    setEndMinute(end.getMinutes());
  }, []);

  // Simulate ticking clock for minutes
  useEffect(() => {
    tickInterval.current = setInterval(() => {
      setEndMinute((prev) => {
        if (prev >= 59) return 0;
        return prev + 1;
      });
    }, 60000); // tick every real minute
    return () => {
      if (tickInterval.current) clearInterval(tickInterval.current);
    };
  }, []);

  if (!spot) return null;

  const displayHour = endHour.toString().padStart(2, "0");
  const displayMinute = endMinute.toString().padStart(2, "0");
  const pricePerHour = spot.price;
  const estimatedCost = (pricePerHour * 2).toFixed(2);

  const handleSlotChange = (index: number) => {
    setCurrentSlot(index);
    // Map slot to time offset (each slot = 30min)
    const now = new Date();
    const offset = index * 30; // minutes
    const end = new Date(now.getTime() + offset * 60 * 1000);
    setEndHour(end.getHours());
    setEndMinute(end.getMinutes());
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex flex-col bg-background"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-start gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-secondary/80 transition-colors mt-1"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">{spot.address.split(",")[0]}</p>
              <h2 className="font-display font-bold text-lg text-foreground leading-tight">{spot.address}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {spot.address} · Open · <span className="text-primary font-medium">See more</span>
              </p>
            </div>
          </div>

          {/* Tariff row */}
          <div className="flex items-center justify-between mt-4 py-3 border-t border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">📋</span>
              <span className="text-sm font-medium text-foreground">Standard tariff</span>
            </div>
            <button className="text-sm font-medium text-primary flex items-center gap-1">
              Rates <ChevronDown className="w-3 h-3 rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* Main content — Clock area */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Parking ends <span className="text-primary font-semibold">Today</span> <ChevronDown className="w-3 h-3 inline" />
            </p>

            {/* Big time display with tick animation */}
            <div className="flex items-center justify-center gap-1 my-4">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={`h-${displayHour}`}
                  className="font-display font-extrabold text-7xl text-foreground tabular-nums"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  {displayHour}
                </motion.span>
              </AnimatePresence>
              <span className="font-display font-extrabold text-7xl text-foreground">:</span>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={`m-${displayMinute}`}
                  className="font-display font-extrabold text-7xl text-foreground tabular-nums"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                >
                  {displayMinute}
                </motion.span>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
              <span>${estimatedCost}</span>
              <Info className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Time slot bar */}
          <div className="flex items-end gap-[3px] mt-10">
            {Array.from({ length: totalSlots }).map((_, i) => {
              const isActive = i === currentSlot;
              const isPast = i < currentSlot;
              return (
                <motion.button
                  key={i}
                  onClick={() => handleSlotChange(i)}
                  className={`w-2.5 rounded-sm transition-all ${
                    isActive
                      ? "h-8 bg-primary"
                      : isPast
                        ? "h-5 bg-muted-foreground/25"
                        : "h-5 bg-muted-foreground/15"
                  }`}
                  whileTap={{ scale: 0.8 }}
                  aria-label={`Time slot ${i + 1}`}
                />
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground mt-4">Maximum parking time 7 days.</p>
        </div>

        {/* Bottom actions */}
        <div className="px-4 pb-6 pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-4">
            <button className="text-sm text-foreground font-medium flex items-center gap-1">
              Select vehicle <ChevronDown className="w-3 h-3" />
            </button>
            <button className="text-sm text-foreground font-medium flex items-center gap-1">
              Select payment <ChevronDown className="w-3 h-3" />
            </button>
          </div>
          <motion.button
            className="w-full h-14 rounded-2xl bg-foreground text-background font-semibold text-base"
            whileTap={{ scale: 0.97 }}
          >
            Select payment
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
