import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Navigation, Star, Zap, Shield, Car, CreditCard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./spots-data";

interface BookingSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
  onNavigate?: (spot: SpotMarker) => void;
}

// Duration drum config
const TICK_COUNT = 20;        // 15-min increments → max 5h
const TICK_STEP = 16;         // px per tick (center to center)
const DRUM_WIDTH = 300;       // visible viewport width
const DRUM_HALF = DRUM_WIDTH / 2;
const MAX_TICK_H = 40;
const MIN_TICK_H = 4;

/** Bell-curve height: tallest at center, fades toward edges */
function drumTickHeight(pixelDistFromCenter: number): number {
  const ratio = Math.min(pixelDistFromCenter / DRUM_HALF, 1);
  const curve = 1 - ratio * ratio;          // quadratic falloff
  return MIN_TICK_H + (MAX_TICK_H - MIN_TICK_H) * Math.max(curve, 0);
}

/** Opacity: bright at center, fades toward edges */
function drumTickOpacity(pixelDistFromCenter: number): number {
  const ratio = Math.min(pixelDistFromCenter / DRUM_HALF, 1);
  return 1 - ratio * 0.7;
}

const MODES = ["Now", "Later", "Schedule"] as const;
type Mode = typeof MODES[number];

export default function BookingSheet({ spot, onClose, onNavigate }: BookingSheetProps) {
  const [mode, setMode] = useState<Mode>("Now");
  const [confirmed, setConfirmed] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // ── Duration drum state ──
  const DEFAULT_INDEX = 3; // 4×15min = 60min
  const [scrollPos, setScrollPos] = useState(DEFAULT_INDEX);   // float during drag
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startPos: 0 });

  const scrubberIndex = isDragging ? Math.round(scrollPos) : Math.round(scrollPos);

  const handleDrumDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, startPos: scrollPos };
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [scrollPos]);

  const handleDrumMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const indexDelta = -dx / TICK_STEP;
    const newPos = dragRef.current.startPos + indexDelta;
    setScrollPos(Math.max(0, Math.min(TICK_COUNT - 1, newPos)));
  }, [isDragging]);

  const handleDrumUp = useCallback(() => {
    setIsDragging(false);
    const snapped = Math.max(0, Math.min(TICK_COUNT - 1, Math.round(scrollPos)));
    setScrollPos(snapped);
  }, [scrollPos]);

  const handleTickTap = useCallback((i: number) => {
    if (isDragging) return;
    setScrollPos(i);
  }, [isDragging]);

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

              {/* ── Duration drum ── */}
              <div
                className="relative mt-10 mb-2 touch-none select-none cursor-grab active:cursor-grabbing"
                style={{ width: DRUM_WIDTH, height: MAX_TICK_H + 8 }}
                role="slider"
                aria-label="Select parking duration"
                aria-valuemin={1}
                aria-valuemax={TICK_COUNT}
                aria-valuenow={scrubberIndex + 1}
                onPointerDown={handleDrumDown}
                onPointerMove={handleDrumMove}
                onPointerUp={handleDrumUp}
                onPointerCancel={handleDrumUp}
              >
                {/* Fade masks on edges */}
                <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

                {/* Tick strip — each slot is TICK_STEP wide, strip slides so scrollPos tick is centered */}
                <motion.div
                  className="absolute top-0 bottom-0 flex items-center"
                  animate={{ x: DRUM_HALF - scrollPos * TICK_STEP - TICK_STEP / 2 }}
                  transition={isDragging ? { duration: 0 } : { type: "spring", damping: 28, stiffness: 350 }}
                >
                  {Array.from({ length: TICK_COUNT }).map((_, i) => {
                    const pxFromCenter = (i - scrollPos) * TICK_STEP;
                    const dist = Math.abs(pxFromCenter);
                    const h = drumTickHeight(dist);
                    const opacity = drumTickOpacity(dist);
                    const isCenter = Math.abs(i - scrollPos) < 0.5;

                    return (
                      <div
                        key={i}
                        className="shrink-0 flex items-center justify-center"
                        style={{ width: TICK_STEP, height: MAX_TICK_H + 8 }}
                        onClick={() => handleTickTap(i)}
                      >
                        <div
                          className={`rounded-full ${
                            isCenter ? "bg-primary" : "bg-muted-foreground/20"
                          }`}
                          style={{
                            width: isCenter ? 5 : 3,
                            height: Math.round(h),
                            opacity,
                            transition: "height 80ms ease-out, width 80ms ease-out, opacity 80ms ease-out",
                          }}
                        />
                      </div>
                    );
                  })}
                </motion.div>
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
