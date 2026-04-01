import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Navigation, Star, Zap, Shield, Car, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./spots-data";

interface BookingSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
  onNavigate?: (spot: SpotMarker) => void;
}

// 20 bars: each = 15 min increment → max 5h
const SCRUBBER_COUNT = 20;

const MODES = ["Now", "Later", "Schedule"] as const;
type Mode = typeof MODES[number];

export default function BookingSheet({ spot, onClose, onNavigate }: BookingSheetProps) {
  const [mode, setMode] = useState<Mode>("Now");
  // index 3 = 4×15min = 60min default
  const [scrubberIndex, setScrubberIndex] = useState(3);
  const [confirmed, setConfirmed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Keep "now" in sync so end time ticks in real time
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!spot) return null;

  const durationHours = (scrubberIndex + 1) * 0.25;
  const durationLabel =
    durationHours < 1
      ? `${Math.round(durationHours * 60)} min`
      : durationHours % 1 === 0
        ? `${durationHours}h`
        : `${Math.floor(durationHours)}h ${Math.round((durationHours % 1) * 60)}m`;

  const endTime = new Date(now.getTime() + durationHours * 60 * 60 * 1000);
  const endHH = endTime.getHours().toString().padStart(2, "0");
  const endMM = endTime.getMinutes().toString().padStart(2, "0");
  const timeDisplay = `${endHH}:${endMM}`;

  const total = spot.price * durationHours;
  const serviceFee = Math.round(total * 0.1 * 100) / 100;
  const grandTotal = total + serviceFee;

  const typeLabel =
    spot.type === "garage" ? "🏢 Garage" :
    spot.type === "driveway" ? "🏠 Driveway" : "🅿️ Open lot";

  const handleGetDirections = () => {
    if (onNavigate) onNavigate(spot);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-card flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 350 }}
      >
        {confirmed ? (
          /* ────────────── Confirmation screen ────────────── */
          <motion.div
            className="flex-1 flex flex-col items-center justify-center text-center px-8"
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
          >
            <motion.div
              className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.1 }}
            >
              <Check className="w-10 h-10 text-accent" />
            </motion.div>
            <h2 className="font-display font-extrabold text-2xl text-foreground mb-2">You're all set!</h2>
            <p className="text-muted-foreground text-sm mb-1">{spot.address}</p>
            <p className="text-muted-foreground text-sm mb-8">
              Ends at <span className="text-foreground font-semibold">{timeDisplay}</span>
              {" · "}
              <span className="text-foreground font-semibold">${grandTotal.toFixed(2)}</span>
            </p>
            <Button variant="cta" size="xl" className="w-full rounded-2xl gap-2 mb-3" onClick={handleGetDirections}>
              <Navigation className="w-4 h-4" />
              Get Directions
            </Button>
            <button onClick={onClose} className="text-sm text-muted-foreground underline-offset-2 hover:underline">
              Back to map
            </button>
          </motion.div>
        ) : (
          <>
            {/* ────────── Header ────────── */}
            <div className="pt-14 px-4 pb-3 flex items-start gap-3 shrink-0">
              <button
                onClick={onClose}
                aria-label="Back"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5 focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <div className="flex-1 min-w-0">
                <h2 className="font-display font-bold text-lg leading-tight text-foreground truncate">
                  {spot.address.split(",")[0]?.trim()}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {spot.address} · <span className="text-accent font-medium">Open</span>
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 mt-1">
                <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                <span className="text-sm font-semibold text-foreground">{spot.rating}</span>
              </div>
            </div>

            {/* ────────── Tariff row ────────── */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-b border-border shrink-0">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>{typeLabel}</span>
                {spot.hasSecurity && (
                  <span className="flex items-center gap-1 text-primary text-xs">
                    <Shield className="w-3 h-3" /> Secured
                  </span>
                )}
                {spot.hasEV && (
                  <span className="flex items-center gap-1 text-accent text-xs">
                    <Zap className="w-3 h-3" /> EV Charging
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground">${spot.price.toFixed(2)}/hr</p>
            </div>

            {/* ────────── Mode tabs ────────── */}
            <div className="flex gap-2 px-4 pt-5 pb-1 shrink-0">
              {MODES.map((m) => (
                <motion.button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                    mode === m
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  {m}
                </motion.button>
              ))}
            </div>

            {/* ────────── Time display + scrubber ────────── */}
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <p className="text-sm text-muted-foreground mb-2">
                Parking ends{" "}
                <button className="text-foreground font-semibold inline-flex items-center gap-1 underline-offset-2">
                  Today <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </p>

              <div className="flex items-center gap-1">
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={endHH}
                    className="font-display font-extrabold text-[80px] leading-none tracking-tight text-foreground tabular-nums"
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  >
                    {endHH}
                  </motion.span>
                </AnimatePresence>
                <span className="font-display font-extrabold text-[80px] leading-none tracking-tight text-foreground select-none">:</span>
                <AnimatePresence mode="popLayout">
                  <motion.span
                    key={endMM}
                    className="font-display font-extrabold text-[80px] leading-none tracking-tight text-foreground tabular-nums"
                    initial={{ y: -24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  >
                    {endMM}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.p
                key={grandTotal}
                className="text-sm text-muted-foreground mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="font-semibold text-foreground">${grandTotal.toFixed(2)}</span>
                {" · "}{durationLabel}
              </motion.p>

              {/* Scrubber bars */}
              <div
                className="flex items-center gap-[5px] mt-10 mb-2"
                role="slider"
                aria-label="Select parking duration"
                aria-valuemin={1}
                aria-valuemax={SCRUBBER_COUNT}
                aria-valuenow={scrubberIndex + 1}
              >
                {Array.from({ length: SCRUBBER_COUNT }).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setScrubberIndex(i)}
                    aria-label={`${((i + 1) * 0.25 < 1) ? `${(i + 1) * 15} min` : `${((i + 1) * 0.25).toFixed(2).replace(/\.00$/, "")}h`}`}
                    className={`rounded-full transition-colors ${
                      i === scrubberIndex
                        ? "bg-primary"
                        : i < scrubberIndex
                          ? "bg-primary/40"
                          : "bg-border"
                    }`}
                    style={{ width: 8, height: i === scrubberIndex ? 28 : 8 }}
                    animate={{ height: i === scrubberIndex ? 28 : 8 }}
                    transition={{ type: "spring", damping: 18, stiffness: 300 }}
                    whileTap={{ scale: 0.85 }}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Maximum 5 hours</p>
            </div>

            {/* ────────── Bottom: selectors + confirm ────────── */}
            <div className="px-4 pb-10 shrink-0 space-y-3">
              {/* Vehicle + Payment */}
              <div className="flex gap-2">
                <button
                  className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-3 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Select vehicle"
                >
                  <Car className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1 text-left truncate">Tesla Model 3</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
                <button
                  className="flex-1 flex items-center gap-2 bg-secondary rounded-xl px-3 py-3 focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label="Select payment"
                >
                  <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-foreground flex-1 text-left truncate">Visa •••• 1234</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                </button>
              </div>

              {/* Confirm */}
              <Button
                variant="cta"
                size="xl"
                className="w-full rounded-2xl text-base"
                onClick={() => setConfirmed(true)}
              >
                Confirm Parking · ${grandTotal.toFixed(2)}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
