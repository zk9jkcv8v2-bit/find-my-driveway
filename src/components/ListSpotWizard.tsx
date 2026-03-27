import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, MapPin, DollarSign, Clock, ChevronRight, Check, Upload,
  Sun, Shield, Lock, Zap, ImagePlus, Search, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const STEPS = ["Photos", "Details", "Location", "Availability"];
const OREBRO_CENTER: [number, number] = [59.2753, 15.2134];

const AMENITIES = [
  { id: "access", label: "24/7 Access", icon: Clock },
  { id: "lighting", label: "Lighting", icon: Sun },
  { id: "surveillance", label: "Surveillance", icon: Shield },
  { id: "gate", label: "Gated", icon: Lock },
  { id: "ev", label: "EV Charging", icon: Zap },
  { id: "covered", label: "Covered", icon: Shield },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function createPinIcon() {
  return L.divIcon({
    className: "parkr-marker",
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:hsl(var(--primary));transform:rotate(-45deg);
      border:3px solid hsl(var(--card));box-shadow:0 2px 12px hsl(var(--primary) / 0.4);
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
  const [pinPos, setPinPos] = useState<[number, number]>(OREBRO_CENTER);

  // Photos state
  const [photos, setPhotos] = useState<string[]>([]);

  // Details state
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<"hourly" | "daily">("hourly");
  const [rate, setRate] = useState("8");
  const [spotCount, setSpotCount] = useState("1");

  // Location state
  const [address, setAddress] = useState("");

  // Availability state
  const [available247, setAvailable247] = useState(false);
  const [activeListing, setActiveListing] = useState(true);
  const [daySchedule, setDaySchedule] = useState<Record<string, { enabled: boolean; start: string; end: string }>>(
    Object.fromEntries(DAYS.map(d => [d, { enabled: d === "Friday" || d === "Saturday", start: "12:00 AM", end: "11:59 PM" }]))
  );

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const toggleDay = (day: string) => {
    setDaySchedule(prev => ({ ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } }));
  };

  const handleFakeUpload = () => {
    const fakeUrls = [
      "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1621929747188-0b4dc28498d6?w=400&h=300&fit=crop",
    ];
    if (photos.length < 4) {
      setPhotos(prev => [...prev, fakeUrls[prev.length]]);
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const nextStep = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="h-screen overflow-y-auto bg-background pb-28 px-4 pt-14">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-extrabold text-2xl text-foreground mb-0.5">List Your Spot</h1>
        <p className="text-muted-foreground text-sm mb-6">Earn money from your unused parking</p>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-border"}`} />
            <p className={`text-xs mt-1.5 font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`}>{s}</p>
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
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>

            {/* STEP 0: Photos */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="soft-card p-5">
                  <h3 className="font-display font-bold text-foreground mb-1">Spot images</h3>
                  <p className="text-xs text-muted-foreground mb-4">Add up to 4 high-quality images to your listing.</p>

                  {/* Main upload area */}
                  <motion.button
                    className="w-full aspect-[4/3] rounded-2xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-secondary/70 transition-colors mb-3 overflow-hidden relative"
                    whileTap={{ scale: 0.98 }}
                    onClick={handleFakeUpload}
                  >
                    {photos[0] ? (
                      <>
                        <img src={photos[0]} alt="Spot" className="w-full h-full object-cover absolute inset-0" />
                        <button
                          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-foreground/60 flex items-center justify-center z-10"
                          onClick={(e) => { e.stopPropagation(); removePhoto(0); }}
                        >
                          <X className="w-4 h-4 text-primary-foreground" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Upload className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Tap to upload</p>
                        <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                      </>
                    )}
                  </motion.button>

                  {/* Thumbnail slots */}
                  <div className="flex gap-2">
                    {[1, 2, 3].map(idx => (
                      <motion.button
                        key={idx}
                        className="flex-1 aspect-square rounded-xl bg-secondary border border-border flex items-center justify-center cursor-pointer hover:bg-secondary/70 transition-colors overflow-hidden relative"
                        whileTap={{ scale: 0.95 }}
                        onClick={handleFakeUpload}
                      >
                        {photos[idx] ? (
                          <>
                            <img src={photos[idx]} alt="Spot" className="w-full h-full object-cover absolute inset-0" />
                            <button
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-foreground/60 flex items-center justify-center z-10"
                              onClick={(e) => { e.stopPropagation(); removePhoto(idx); }}
                            >
                              <X className="w-3 h-3 text-primary-foreground" />
                            </button>
                          </>
                        ) : (
                          <ImagePlus className="w-5 h-5 text-muted-foreground" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Spot Details */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="soft-card p-5">
                  <h3 className="font-display font-bold text-foreground mb-1">Spot details</h3>
                  <p className="text-xs text-muted-foreground mb-4">Add important details about your spot to help potential buyers.</p>

                  {/* Amenities */}
                  <p className="text-xs font-semibold text-foreground mb-2">Amenities</p>
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    {AMENITIES.map(a => {
                      const selected = selectedAmenities.includes(a.id);
                      return (
                        <motion.button
                          key={a.id}
                          className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                            selected
                              ? "bg-primary/10 border-primary text-primary"
                              : "bg-secondary border-border text-muted-foreground"
                          }`}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleAmenity(a.id)}
                        >
                          <a.icon className="w-5 h-5" />
                          <span className="text-[10px] font-medium leading-tight">{a.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>

                  {/* Description */}
                  <p className="text-xs font-semibold text-foreground mb-2">Description</p>
                  <textarea
                    className="w-full rounded-xl bg-secondary border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 mb-5"
                    rows={3}
                    placeholder="Driveway near venue..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />

                  {/* Duration */}
                  <p className="text-xs font-semibold text-foreground mb-2">Duration</p>
                  <div className="flex rounded-xl bg-secondary p-1 mb-5">
                    {(["hourly", "daily"] as const).map(d => (
                      <button
                        key={d}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                          duration === d ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                        }`}
                        onClick={() => setDuration(d)}
                      >
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* Rate */}
                  <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground mb-2">{duration === "hourly" ? "Hourly" : "Daily"} rate</p>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <Input
                          type="number"
                          className="pl-8 bg-secondary border-border rounded-xl"
                          value={rate}
                          onChange={e => setRate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-foreground mb-2">Available spots</p>
                      <Input
                        type="number"
                        className="bg-secondary border-border rounded-xl"
                        value={spotCount}
                        onChange={e => setSpotCount(e.target.value)}
                        min={1}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Location */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="soft-card p-5">
                  <h3 className="font-display font-bold text-foreground mb-1">Location</h3>
                  <p className="text-xs text-muted-foreground mb-4">Add location by tapping the map or entering address and pressing "Find address on map".</p>

                  {/* Address input */}
                  <div className="relative mb-3">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      className="pl-9 bg-secondary border-border rounded-xl"
                      placeholder="Enter address..."
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm" className="w-full rounded-xl mb-4 text-xs">
                    <MapPin className="w-3.5 h-3.5 mr-1.5" /> Find address on map
                  </Button>

                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-3">
                    <MapContainer center={OREBRO_CENTER} zoom={14} className="w-full h-full" zoomControl={false} attributionControl={false}>
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      <DraggablePin position={pinPos} onMove={setPinPos} />
                    </MapContainer>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-foreground">{pinPos[0].toFixed(4)}, {pinPos[1].toFixed(4)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Availability */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="soft-card p-5">
                  <h3 className="font-display font-bold text-foreground mb-1">Availability</h3>
                  <p className="text-xs text-muted-foreground mb-4">Set your spot's availability based on your schedule.</p>

                  {/* 24/7 toggle */}
                  <div className="flex items-center justify-between py-3 border-b border-border mb-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">Available 24/7</span>
                      <span className="text-[10px] text-muted-foreground ml-1.5">(recommended)</span>
                    </div>
                    <Switch checked={available247} onCheckedChange={setAvailable247} />
                  </div>

                  {/* Per-day schedule */}
                  {!available247 && (
                    <div className="space-y-1 mt-3">
                      {DAYS.map(day => (
                        <div key={day} className="flex items-center gap-2 py-2">
                          <Switch
                            checked={daySchedule[day].enabled}
                            onCheckedChange={() => toggleDay(day)}
                            className="scale-[0.8]"
                          />
                          <span className={`text-sm w-24 ${daySchedule[day].enabled ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                            {day}
                          </span>
                          {daySchedule[day].enabled && (
                            <div className="flex items-center gap-1 ml-auto">
                              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-md">{daySchedule[day].start}</span>
                              <span className="text-[10px] text-muted-foreground">–</span>
                              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-1 rounded-md">{daySchedule[day].end}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active listing */}
                  <div className="flex items-center justify-between py-3 border-t border-border mt-3">
                    <span className="text-sm font-medium text-foreground">Active listing</span>
                    <Switch checked={activeListing} onCheckedChange={setActiveListing} />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      {!completed && (
        <motion.div className="mt-6 flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {step > 0 && (
            <Button variant="outline" size="xl" className="rounded-2xl font-display px-6" onClick={prevStep}>
              Back
            </Button>
          )}
          <Button variant="cta" size="xl" className="flex-1 rounded-2xl font-display" onClick={nextStep}>
            {step === STEPS.length - 1 ? "Create listing" : "Continue"}
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}