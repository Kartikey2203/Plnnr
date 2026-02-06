"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function AIEventCreator({ onEventGenerated, themeColor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate event");
      }

      const data = await response.json();
      onEventGenerated(data);
      setIsOpen(false);
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2 transition-all group overflow-hidden relative"
          style={{ 
            borderColor: `${themeColor}40`,
            backgroundColor: `${themeColor}05`,
          }}
        >
          {/* Subtle hover background */}
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
            style={{ backgroundColor: themeColor }}
          />
          
          <Sparkles 
            className="w-4 h-4 group-hover:scale-110 transition-transform duration-500" 
            style={{ color: themeColor }}
          />
          <span 
            className="font-semibold"
            style={{ color: themeColor }}
          >
            Generate with AI
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Event Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            placeholder="Describe your event (e.g., 'A weekend hackathon for junior developers in Bangalore')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
