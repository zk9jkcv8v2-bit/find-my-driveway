import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./MapView";
import { useState } from "react";

interface BookingSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
}

const TIME_OPTIONS = [
  { label: "Right Now", icon: Zap, duration: "1 hr" },
  { label: "Later Today", icon: Clock, duration: "2 hrs" },
  { label: "Schedule", icon: Calendar, duration: "Custom" },
];

export default function BookingSheet({ spot, onClose }: BookingSheetProps) {
  const [selectedTime, setSelectedTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [confirmed, setConfirmed] = useState(false);

  if (!spot) return null;

  const total = spot.price * duration;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full max-w-lg glass-card rounded-b-none p-6 pb-8"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Handle */}
          <div className="flex justify-center mb-4">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>

          {!confirmed ? (
            <>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">Book this spot</h2>
              <p className="text-muted-foreground text-sm mb-5">{spot.address}</p>

              {/* Time selection */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {TIME_OPTIONS.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedTime(i)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                        selectedTime === i
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Duration */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">Duration</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                    className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold"
                  >−</button>
                  <span className="font-display font-semibold text-lg text-foreground w-12 text-center">{duration}h</span>
                  <button
                    onClick={() => setDuration(Math.min(12, duration + 1))}
                    className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold"
                  >+</button>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 mb-5">
                <span className="text-muted-foreground">Total</span>
                <span className="font-display font-bold text-2xl text-foreground">${total.toFixed(2)}</span>
              </div>

              <Button
                variant="glow"
                className="w-full h-14 text-lg font-display font-bold rounded-xl"
                onClick={() => setConfirmed(true)}
              >
                Confirm & Pay ${total.toFixed(2)}
              </Button>
            </>
          ) : (
            <motion.div
              className="text-center py-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-2">Spot Booked!</h2>
              <p className="text-muted-foreground text-sm mb-6">{spot.address} · {duration}h · ${total.toFixed(2)}</p>
              <Button variant="glow" className="w-full h-12 rounded-xl font-display font-semibold" onClick={onClose}>
                Navigate to Spot
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
