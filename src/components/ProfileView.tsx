import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Shield, Car, MapPin, ChevronRight, Bell, HelpCircle, LogOut, ArrowLeft, Check, Plus, Trash2, Settings, Moon, Sun, Globe, Palette, DollarSign } from "lucide-react";
import EarningsDashboard from "@/components/EarningsDashboard";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type SubScreen = "main" | "verification" | "vehicles" | "saved" | "notifications" | "help" | "settings" | "earnings";
type ThemeMode = "light" | "dark" | "system";

const SAVED_SPOTS = [
  { id: "1", address: "742 Valencia St", type: "Driveway", price: 5 },
  { id: "2", address: "180 Mission St", type: "Garage", price: 8 },
  { id: "3", address: "55 3rd St", type: "Driveway", price: 3 },
  { id: "4", address: "888 Brannan St", type: "Lot", price: 6 },
  { id: "5", address: "123 Folsom St", type: "Driveway", price: 4 },
];

const VEHICLES = [
  { id: "1", make: "Tesla Model 3", plate: "7ABC123", color: "White", isEV: true },
  { id: "2", make: "Honda Civic", plate: "8XYZ789", color: "Blue", isEV: false },
];

const FAQ = [
  { q: "How do I book a parking spot?", a: "Tap any pin on the map, review details, and tap 'Book'. Choose your time and confirm payment." },
  { q: "How do payouts work?", a: "Earnings accumulate in your balance. Tap 'Withdraw' in the Earnings tab to transfer to your bank (1–2 business days)." },
  { q: "What if someone is in my spot?", a: "Contact support through this page. We'll resolve disputes within 24 hours and compensate for inconvenience." },
  { q: "How do I cancel a booking?", a: "Go to your bookings and tap the booking you want to cancel. Free cancellation up to 1 hour before." },
];

export default function ProfileView() {
  const [subScreen, setSubScreen] = useState<SubScreen>("main");
  const [notifBookings, setNotifBookings] = useState(true);
  const [notifEarnings, setNotifEarnings] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [savedSpots, setSavedSpots] = useState(SAVED_SPOTS);
  const [vehicles, setVehicles] = useState(VEHICLES);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem("parkr-theme") as ThemeMode | null;
    return saved || "light";
  });
  const [language, setLanguage] = useState("English");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) root.classList.add("dark");
      else root.classList.remove("dark");
    }
    localStorage.setItem("parkr-theme", theme);
  }, [theme]);

  const BackButton = () => (
    <button onClick={() => setSubScreen("main")} className="flex items-center gap-1 text-sm text-muted-foreground mb-6 hover:text-foreground transition-colors">
      <ArrowLeft className="w-4 h-4" /> Back
    </button>
  );

  if (subScreen === "verification") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Verification</h1>
          <p className="text-muted-foreground text-sm mb-6">Your identity verification status</p>
        </motion.div>

        <div className="space-y-3">
          {[
            { label: "Email Address", value: "jordan@email.com", verified: true },
            { label: "Phone Number", value: "+1 (415) ***-4829", verified: true },
            { label: "Driver's License", value: "Verified", verified: true },
            { label: "Payment Method", value: "Visa •••• 1234", verified: true },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="soft-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.value}</p>
              </div>
              <span className="text-[10px] font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">Verified</span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (subScreen === "vehicles") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">My Vehicles</h1>
          <p className="text-muted-foreground text-sm mb-6">Manage your registered vehicles</p>
        </motion.div>

        <div className="space-y-3 mb-6">
          {vehicles.map((v, i) => (
            <motion.div
              key={v.id}
              className="soft-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{v.make}</p>
                  {v.isEV && <span className="text-[10px] font-medium text-accent bg-accent/10 px-1.5 py-0.5 rounded-full">EV</span>}
                </div>
                <p className="text-xs text-muted-foreground">{v.plate} · {v.color}</p>
              </div>
              <button
                onClick={() => {
                  setVehicles(vehicles.filter(x => x.id !== v.id));
                  toast({ title: "Vehicle removed", description: `${v.make} has been removed.` });
                }}
                className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-2xl gap-2"
          onClick={() => {
            const newId = String(vehicles.length + 1);
            setVehicles([...vehicles, { id: newId, make: "New Vehicle", plate: "NEW-0000", color: "Black", isEV: false }]);
            toast({ title: "Vehicle added", description: "Don't forget to update the details." });
          }}
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </Button>
      </div>
    );
  }

  if (subScreen === "saved") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Saved Spots</h1>
          <p className="text-muted-foreground text-sm mb-6">Your favorite parking spots</p>
        </motion.div>

        <div className="space-y-2">
          {savedSpots.map((spot, i) => (
            <motion.div
              key={spot.id}
              className="soft-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{spot.address}</p>
                <p className="text-xs text-muted-foreground">{spot.type} · ${spot.price}/hr</p>
              </div>
              <button
                onClick={() => {
                  setSavedSpots(savedSpots.filter(s => s.id !== spot.id));
                  toast({ title: "Spot removed", description: `${spot.address} removed from saved.` });
                }}
                className="w-8 h-8 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
          {savedSpots.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No saved spots yet</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (subScreen === "notifications") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Notifications</h1>
          <p className="text-muted-foreground text-sm mb-6">Manage your notification preferences</p>
        </motion.div>

        <div className="space-y-1">
          {[
            { label: "Booking Updates", desc: "New bookings, cancellations, reminders", value: notifBookings, onChange: setNotifBookings },
            { label: "Earnings Alerts", desc: "Payouts, new earnings, milestones", value: notifEarnings, onChange: setNotifEarnings },
            { label: "Promotions", desc: "Deals, tips, and new features", value: notifPromo, onChange: setNotifPromo },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="soft-card p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.onChange(!item.value)}
                className={`w-11 h-6 rounded-full flex items-center p-0.5 transition-colors ${
                  item.value ? "bg-primary justify-end" : "bg-border justify-start"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-white soft-shadow transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (subScreen === "help") {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Help & Support</h1>
          <p className="text-muted-foreground text-sm mb-6">Frequently asked questions</p>
        </motion.div>

        <div className="space-y-2 mb-6">
          {FAQ.map((item, i) => (
            <motion.div
              key={i}
              className="soft-card overflow-hidden"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-4 flex items-center gap-3 text-left"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.q}</p>
                </div>
                <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${expandedFaq === i ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-muted-foreground">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-2xl"
          onClick={() => toast({ title: "Support ticket created", description: "We'll get back to you within 24 hours." })}
        >
          Contact Support
        </Button>
      </div>
    );
  }

  if (subScreen === "settings") {
    const THEME_OPTIONS: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
      { value: "light", label: "Light", icon: Sun },
      { value: "dark", label: "Dark", icon: Moon },
      { value: "system", label: "System", icon: Palette },
    ];

    const LANGUAGES = ["English", "Svenska", "Deutsch", "Español"];

    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-14">
        <BackButton />
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display font-extrabold text-2xl text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground text-sm mb-6">Customize your app experience</p>
        </motion.div>

        {/* Appearance */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Appearance</p>
          <div className="soft-card p-2 mb-5">
            <div className="grid grid-cols-3 gap-1">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = theme === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTheme(opt.value);
                      toast({ title: `Theme: ${opt.label}`, description: `Switched to ${opt.label.toLowerCase()} mode.` });
                    }}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${
                      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Language</p>
          <div className="soft-card overflow-hidden mb-5">
            {LANGUAGES.map((lang, i) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  toast({ title: "Language updated", description: `App language set to ${lang}.` });
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 transition-colors ${
                  i < LANGUAGES.length - 1 ? "border-b border-border" : ""
                } ${language === lang ? "bg-primary/5" : "hover:bg-secondary/50"}`}
              >
                <div className="flex items-center gap-3">
                  <Globe className={`w-4 h-4 ${language === lang ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${language === lang ? "text-primary" : "text-foreground"}`}>{lang}</span>
                </div>
                {language === lang && <Check className="w-4 h-4 text-primary" />}
              </button>
            ))}
          </div>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</p>
          <div className="soft-card overflow-hidden">
            {[
              { label: "Version", value: "1.0.0" },
              { label: "Terms of Service", value: "" },
              { label: "Privacy Policy", value: "" },
            ].map((item, i) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-4 py-3.5 hover:bg-secondary/50 transition-colors ${
                  i < 2 ? "border-b border-border" : ""
                }`}
              >
                <span className="text-sm font-medium text-foreground">{item.label}</span>
                {item.value ? (
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  // Main profile
  const MENU_ITEMS = [
    { label: "Settings", icon: Settings, desc: "Theme, language, preferences", color: "text-muted-foreground", screen: "settings" as SubScreen },
    { label: "Verification", icon: Shield, desc: "Identity verified", color: "text-accent", screen: "verification" as SubScreen },
    { label: "My Vehicles", icon: Car, desc: `${vehicles.length} vehicles added`, color: "text-primary", screen: "vehicles" as SubScreen },
    { label: "Saved Spots", icon: MapPin, desc: `${savedSpots.length} saved`, color: "text-primary", screen: "saved" as SubScreen },
    { label: "Notifications", icon: Bell, desc: "Manage preferences", color: "text-primary", screen: "notifications" as SubScreen },
    { label: "Help & Support", icon: HelpCircle, desc: "FAQ, disputes", color: "text-muted-foreground", screen: "help" as SubScreen },
  ];

  return (
    <div className="min-h-screen bg-background pb-24 px-4 pt-14">
      {/* Profile header */}
      <motion.div
        className="flex items-center gap-4 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-display font-extrabold text-primary">
          JD
        </div>
        <div className="flex-1">
          <h1 className="font-display font-extrabold text-xl text-foreground">Jordan Doe</h1>
          <p className="text-sm text-muted-foreground">Member since 2024</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="soft-card p-3 text-center">
          <p className="font-display font-extrabold text-lg text-foreground">47</p>
          <p className="text-[10px] text-muted-foreground">Bookings</p>
        </div>
        <div className="soft-card p-3 text-center">
          <div className="flex items-center justify-center gap-0.5">
            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
            <p className="font-display font-extrabold text-lg text-foreground">4.9</p>
          </div>
          <p className="text-[10px] text-muted-foreground">Rating</p>
        </div>
        <div className="soft-card p-3 text-center">
          <p className="font-display font-extrabold text-lg text-accent">✓</p>
          <p className="text-[10px] text-muted-foreground">Verified</p>
        </div>
      </motion.div>

      {/* Menu */}
      <div className="space-y-1.5">
        {MENU_ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.button
              key={item.label}
              className="soft-card p-4 w-full flex items-center gap-3 hover:bg-secondary/50 transition-colors"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
              onClick={() => setSubScreen(item.screen)}
            >
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <Icon className={`w-[18px] h-[18px] ${item.color}`} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          );
        })}
      </div>

      {/* Sign out */}
      <motion.button
        className="flex items-center gap-2 mt-8 mx-auto text-sm text-muted-foreground hover:text-destructive transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={() => toast({ title: "Signed out", description: "You've been signed out successfully." })}
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </motion.button>
    </div>
  );
}
