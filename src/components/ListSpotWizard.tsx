import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, DollarSign, Clock, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = ["Photo", "Location", "Pricing", "Schedule"];

export default function ListSpotWizard() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-foreground mb-1">List Your Spot</h1>
        <p className="text-muted-foreground text-sm mb-6">Start earning from your parking space</p>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-primary" : "bg-muted"
            }`} />
            <p className={`text-[10px] mt-1 ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div
            key="done"
            className="text-center py-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 glow-primary">
              <Check className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-2">Spot Listed!</h2>
            <p className="text-muted-foreground text-sm">Your spot is now live. Drivers can find and book it.</p>
          </motion.div>
        ) : (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && (
              <div className="glass-card p-6 flex flex-col items-center gap-4">
                <div className="w-full aspect-video rounded-xl bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
                  <Camera className="w-10 h-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Tap to take a photo of your spot</p>
                </div>
                <p className="text-xs text-muted-foreground text-center">Our AI will analyze your photo to suggest the best price</p>
              </div>
            )}

            {step === 1 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">Spot Location</h3>
                </div>
                <div className="w-full h-40 rounded-xl bg-muted/50 mb-4" style={{
                  background: "radial-gradient(circle at center, hsl(222 44% 14%) 0%, hsl(222 47% 8%) 100%)"
                }}>
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary glow-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">📍 742 Valencia St, San Francisco, CA</p>
              </div>
            )}

            {step === 2 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-semibold text-foreground">Set Your Price</h3>
                </div>
                <div className="text-center py-6">
                  <p className="text-xs text-muted-foreground mb-2">AI Suggested Price</p>
                  <p className="font-display font-bold text-5xl text-foreground mb-1">$8</p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 text-sm">
                  <span className="text-primary">🤖 Based on 12 nearby spots</span>
                  <span className="text-primary font-semibold">$5–$12/hr</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">Availability</h3>
                </div>
                {["Mon–Fri", "Sat–Sun"].map((range) => (
                  <div key={range} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                    <span className="text-sm text-foreground">{range}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">9:00 AM – 5:00 PM</span>
                      <div className="w-10 h-6 rounded-full bg-primary flex items-end justify-end p-0.5">
                        <div className="w-5 h-5 rounded-full bg-primary-foreground" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!completed && (
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Button
            variant="glow"
            className="w-full h-14 text-lg font-display font-bold rounded-xl"
            onClick={nextStep}
          >
            {step === STEPS.length - 1 ? "Publish Spot" : "Continue"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
