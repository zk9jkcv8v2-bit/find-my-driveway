import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, DollarSign, Clock, ChevronRight, Check, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STEPS = ["Photo", "Location", "Price", "Hours"];

const SF_CENTER: [number, number] = [37.7749, -122.4194];

function createPinIcon() {
  return L.divIcon({
    className: "parkr-marker",
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:hsl(217,91%,60%);transform:rotate(-45deg);
      border:3px solid #fff;box-shadow:0 2px 12px rgba(59,130,246,0.4);
    "></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

function DraggablePin({ position, onMove }: { position: [number, number]; onMove: (pos: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onMove([e.latlng.lat, e.latlng.lng]);
    },
  });
  return <Marker position={position} icon={createPinIcon()} />;
}

export default function ListSpotWizard() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [pinPos, setPinPos] = useState<[number, number]>(SF_CENTER);

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-14">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-extrabold text-2xl text-foreground mb-0.5">List Your Spot</h1>
        <p className="text-muted-foreground text-sm mb-6">Earn money from your unused parking</p>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"}`} />
            <p className={`text-[10px] mt-1.5 font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {completed ? (
          <motion.div key="done" className="text-center py-16" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-5">
              <Check className="w-10 h-10 text-accent" />
            </div>
            <h2 className="font-display font-bold text-xl text-foreground mb-2">Spot Listed! 🎉</h2>
            <p className="text-muted-foreground text-sm max-w-[240px] mx-auto">Your parking spot is now visible to drivers nearby.</p>
          </motion.div>
        ) : (
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <div className="soft-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Camera className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Add Photos</h3>
                </div>
                <div className="w-full aspect-[4/3] rounded-2xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-secondary/70 transition-colors">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Tap to upload</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-3">Our AI will analyze your spot to suggest the best price</p>
              </div>
            )}

            {step === 1 && (
              <div className="soft-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Spot Location</h3>
                </div>
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-4">
                  <MapContainer center={SF_CENTER} zoom={14} className="w-full h-full" zoomControl={false} attributionControl={false}>
                    <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                    <DraggablePin position={pinPos} onMove={setPinPos} />
                  </MapContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center">Tap on the map to set your spot's location</p>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary mt-3">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-sm text-foreground">{pinPos[0].toFixed(4)}, {pinPos[1].toFixed(4)}</p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="soft-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-accent" />
                  <h3 className="font-display font-bold text-foreground">Set Your Price</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground mb-2">AI Suggested Price</p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="font-display font-extrabold text-5xl text-foreground">$8</span>
                    <span className="text-muted-foreground text-sm">/hr</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-accent/10">
                  <span className="text-sm text-accent font-medium">Based on 12 nearby spots</span>
                  <span className="text-sm text-accent font-bold">$5–$12</span>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="soft-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-bold text-foreground">Set Availability</h3>
                </div>
                {["Weekdays", "Weekends"].map((range) => (
                  <div key={range} className="flex items-center justify-between py-4 border-b border-border last:border-0">
                    <div>
                      <span className="text-sm font-medium text-foreground">{range}</span>
                      <p className="text-xs text-muted-foreground">9:00 AM – 5:00 PM</p>
                    </div>
                    <div className="w-11 h-6 rounded-full bg-primary flex items-center justify-end p-0.5 cursor-pointer">
                      <div className="w-5 h-5 rounded-full bg-primary-foreground soft-shadow" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!completed && (
        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <Button variant="cta" size="xl" className="w-full rounded-2xl font-display" onClick={nextStep}>
            {step === STEPS.length - 1 ? "Publish Spot" : "Continue"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
