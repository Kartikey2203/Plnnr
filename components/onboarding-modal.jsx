import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Heart, 
  MapPin,
  Laptop,
  Music,
  Trophy,
  Palette,
  Utensils,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Gamepad2,
  Users,
  Tent,
  Building2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CATEGORIES } from "@/lib/data";

const iconMap = {
  tech: Laptop,
  music: Music,
  sports: Trophy,
  art: Palette,
  food: Utensils,
  business: Briefcase,
  health: HeartPulse,
  education: GraduationCap,
  gaming: Gamepad2,
  networking: Users,
  outdoor: Tent,
  community: Building2,
};

export default function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const progress = (step / 2) * 100;

  const toggleInterest = (categoryId) => {
    setSelectedInterests((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedInterests.length < 3) {
      // You could add a toast here if you have sonner installed
      return;
    }
    // For now dealing with step 1 only as per user request focus
    onComplete(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl bg-black border-white/10 text-white p-0 overflow-hidden">
        <div className="p-6 pb-0">
           <DialogHeader>
            <div className="mb-6">
                <Progress value={progress} className="h-1 bg-white/10" indicatorClassName="bg-white" />
            </div>
            
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
                <Heart className="h-6 w-6 text-purple-500 fill-purple-500" />
                What interests you?
            </DialogTitle>
            
            <DialogDescription className="text-gray-400 text-base mt-2">
                Select at least 3 categories to personalize your experience
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {CATEGORIES.map((category) => {
                  const IconComponent = iconMap[category.id] || Laptop;
                  const isSelected = selectedInterests.includes(category.id);
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className={`
                        relative group p-4 rounded-xl border transition-all duration-300 flex flex-col items-center justify-center gap-3
                        ${
                          isSelected
                            ? "bg-purple-500/20 border-purple-500"
                            : "bg-white/5 border-white/10 hover:border-purple-500/50 hover:bg-white/10"
                        }
                      `}
                    >
                      <div 
                        className={`
                          p-3 rounded-full transition-all duration-300
                          ${isSelected ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]" : "bg-white/10 text-gray-400 group-hover:text-white group-hover:bg-white/20"}
                        `}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className={`text-sm font-medium transition-colors ${isSelected ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                        {category.label}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-white/5 border-t border-white/10 flex flex-row items-center justify-between">
           <div className="text-sm text-gray-400">
             {selectedInterests.length} selected
           </div>
           
           <Button 
             onClick={handleNext}
             disabled={selectedInterests.length < 3}
             className="bg-white text-black hover:bg-gray-200 font-semibold px-8 rounded-full transition-all"
           >
             Continue
           </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
