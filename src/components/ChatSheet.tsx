import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotMarker } from "./MapView";

interface ChatSheetProps {
  spot: SpotMarker | null;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "host";
  time: string;
}

const HOST_REPLIES = [
  "Hi! Thanks for your interest in my spot 😊",
  "Yes, it's available right now!",
  "Sure, I can hold it for you for 15 minutes.",
  "The entrance is on the left side of the building.",
  "No problem, let me know if you need anything else!",
];

export default function ChatSheet({ spot, onClose }: ChatSheetProps) {
  const hostName = spot?.host?.name ?? "Host";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      text: `Hi! I'm ${hostName}, the host for ${spot?.address}. How can I help you?`,
      sender: "host",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      time: "Now",
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    // Fake host reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: HOST_REPLIES[Math.floor(Math.random() * HOST_REPLIES.length)],
        sender: "host",
        time: "Now",
      };
      setMessages(prev => [...prev, reply]);
    }, 1000 + Math.random() * 1500);
  };

  if (!spot) return null;

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
          className="relative w-full max-w-lg bg-card rounded-t-3xl soft-shadow-xl flex flex-col"
          style={{ height: "75vh" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 28, stiffness: 350 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">H</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Spot Host</p>
                <p className="text-[10px] text-accent font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-secondary text-foreground rounded-bl-md"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
              />
              <Button
                variant="cta"
                size="icon"
                className="rounded-full h-10 w-10 shrink-0"
                onClick={sendMessage}
                disabled={!input.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
