import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, Zap, Check, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./MapView";
import { useState } from "react";

interface BookingSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
  onNavigate?: (spot: SpotMarker) => void;
}

const TIME_OPTIONS = [
  { label: "Now", icon: Zap, sub: "Start immediately" },
  { label: "Later", icon: Clock, sub: "Pick a time" },
  { label: "Schedule", icon: Calendar, sub: "Book ahead" },
];

export default function BookingSheet({ spot, onClose, onNavigate }: BookingSheetProps) {
  const [selectedTime, setSelectedTime] = useState(0);
  const [duration, setDuration] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  if (!spot) return null;

  const total = spot.price * duration;
  const serviceFee = Math.round(total * 0.1 * 100) / 100;
  const grandTotal = total + serviceFee;

  const handleGetDirections = () => {
    if (onNavigate) {
      onNavigate(spot);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        <motion.div
          className="relative w-full max-w-lg bg-card rounded-t-3xl p-5 pb-8 soft-shadow-xl"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          <div className="flex justify-center mb-3">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>

          {!confirmed ? (
            <>
              <div className="mb-5">
                <h2 className="font-display font-bold text-lg text-foreground">Book Parking</h2>
                <p className="text-sm text-muted-foreground">{spot.address}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-5">
                {TIME_OPTIONS.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setSelectedTime(i)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all ${
                        selectedTime === i
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selectedTime === i ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-semibold ${selectedTime === i ? "text-primary" : "text-foreground"}`}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between bg-secondary rounded-2xl p-4 mb-5">
                <span className="text-sm font-medium text-foreground">Duration</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setDuration(Math.max(1, duration - 1))}
                    className="w-8 h-8 rounded-full bg-card border border-border text-foreground flex items-center justify-center font-bold text-lg active:bg-secondary transition-colors"
                  >−</button>
                  <span className="font-display font-bold text-lg text-foreground w-8 text-center">{duration}h</span>
                  <button
                    onClick={() => setDuration(Math.min(12, duration + 1))}
                    className="w-8 h-8 rounded-full bg-card border border-border text-foreground flex items-center justify-center font-bold text-lg active:bg-secondary transition-colors"
                  >+</button>
                </div>
              </div>

              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">${spot.price} × {duration} hours</span>
                  <span className="text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-display font-extrabold text-lg text-foreground">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button variant="cta" size="xl" className="w-full rounded-2xl" onClick={() => setConfirmed(true)}>
                Confirm Parking · ${grandTotal.toFixed(2)}
              </Button>
            </>
          ) : (
            <motion.div
              className="text-center py-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-accent" />
              </div>
              <h2 className="font-display font-bold text-xl text-foreground mb-1">You're all set!</h2>
              <p className="text-muted-foreground text-sm mb-6">{spot.address} · {duration}h · ${grandTotal.toFixed(2)}</p>
              <Button variant="cta" size="lg" className="w-full rounded-2xl gap-2" onClick={handleGetDirections}>
                <Navigation className="w-4 h-4" />
                Get Directions
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
