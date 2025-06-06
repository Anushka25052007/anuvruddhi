
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, Bird, Star, Heart, Brain } from "lucide-react";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { ForestWheel } from "@/components/motivation/ForestWheel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DailyWheel() {
  const [intention, setIntention] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [aiAdvice, setAiAdvice] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Simulate wheel spin completion after 3 seconds
    setTimeout(() => {
      setIsSpinning(false);
      const rewards = [
        "100 Karma XP",
        "Daily Wisdom Quote",
        "5-min Nature Break",
        "Forest Guardian Badge",
        "Mindful Moment",
        "Energy Boost",
      ];
      const reward = rewards[Math.floor(Math.random() * rewards.length)];
      setSelectedReward(reward);
      setSpinCount(spinCount + 1);
      toast.success(`You received: ${reward}`, {
        description: "May this gift guide your journey today",
      });
      
      // Show AI advice if intention is set
      if (intention.trim()) {
        setIsLoading(true);
        setTimeout(() => {
          generateAIAdvice(intention);
        }, 500);
      }
    }, 3000);
  };

  const handleSetIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;
    
    toast.success("Daily intention set!", {
      description: "Your focus word will guide your path today",
    });
  };
  
  const generateAIAdvice = (userIntention: string) => {
    // Simulate AI advice generation (in a real app, this would call an API)
    setIsLoading(true);
    
    setTimeout(() => {
      const adviceOptions = [
        `For your intention to '${userIntention}', try breaking it down into 3 small actions you can take today. Start with just 5 minutes of focused effort.`,
        `To achieve '${userIntention}', consider creating a visual reminder of your goal somewhere you'll see it frequently throughout the day.`,
        `Your goal to '${userIntention}' is admirable! Try pairing this new habit with something you already do daily to build consistency.`,
        `For '${userIntention}', consider finding an accountability partner who shares a similar goal. Schedule weekly check-ins to share progress.`,
        `To make progress on '${userIntention}', set a specific time each day dedicated solely to this intention. Even 10 minutes of consistent effort will compound over time.`
      ];
      
      const selectedAdvice = adviceOptions[Math.floor(Math.random() * adviceOptions.length)];
      setAiAdvice(selectedAdvice);
      setIsLoading(false);
      setIsDialogOpen(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FEF7CD] to-[#FDE1D3] relative overflow-hidden">
      <ParticleEffect />
      
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-20 w-40 h-40 rounded-full bg-[#D946EF]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-[#9b87f5]/10 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block relative mb-4">
            <Star className="absolute -top-4 -left-4 h-6 w-6 text-yellow-400 animate-pulse" />
            <h1 className="text-4xl font-bold text-[#2D3047] mb-2 bg-gradient-to-r from-[#D946EF] to-[#9b87f5] bg-clip-text text-transparent">
              Wisdom Wheel of Fortune
            </h1>
            <Star className="absolute -bottom-4 -right-4 h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-[#5D4E7B] text-lg">Spin to receive cosmic guidance for your day</p>
        </motion.div>

        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-[#9b87f5]/20 shadow-[0_5px_15px_rgba(155,135,245,0.1)]">
          <form onSubmit={handleSetIntention} className="space-y-4">
            <label
              htmlFor="intention"
              className="block text-sm font-medium text-[#5D4E7B]"
            >
              Set Today's Intention
            </label>
            <div className="flex gap-2">
              <Input
                id="intention"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Enter a word or phrase to focus on..."
                className="flex-1 border-[#9b87f5]/30 focus:border-[#9b87f5] focus:ring-[#9b87f5]/20"
              />
              <Button type="submit" className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:opacity-90">
                <Bird className="mr-2" />
                Set
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Glowing background for the wheel */}
          <div className="relative">
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#9b87f5]/30 to-[#D946EF]/30 blur-lg"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, repeatType: "reverse" },
              }}
            />
            <ForestWheel isSpinning={isSpinning} />
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="bg-gradient-to-r from-[#F97316] to-[#FB923C] hover:opacity-90 text-white px-8 py-6 rounded-full text-lg shadow-[0_5px_15px_rgba(249,115,22,0.3)]"
            >
              <Sparkles className="mr-2" />
              Spin the Wheel
            </Button>
          </motion.div>

          {selectedReward && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center p-3 bg-white/80 backdrop-blur-sm rounded-lg border border-[#9b87f5]/20 shadow-[0_5px_15px_rgba(155,135,245,0.1)]"
            >
              <div className="flex items-center justify-center">
                <Heart className="h-5 w-5 text-[#D946EF] mr-2" />
                <span className="text-[#5D4E7B] font-medium text-lg">{selectedReward}</span>
              </div>
              <div className="mt-2 text-[#5D4E7B]/70 text-sm">
                You've spun the wheel {spinCount} time{spinCount !== 1 ? 's' : ''} today
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* AI Advice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white/95 backdrop-blur-md border border-[#9b87f5]/30">
          <DialogHeader>
            <DialogTitle className="flex items-center text-[#5D4E7B]">
              <Brain className="mr-2 h-5 w-5 text-[#D946EF]" />
              Wisdom Guide for Your Intention
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-4">
                <motion.div
                  className="h-12 w-12 rounded-full border-4 border-t-[#9b87f5] border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-[#5D4E7B]">Consulting the wisdom oracle...</p>
              </div>
            ) : (
              <div className="p-4 bg-[#9b87f5]/10 rounded-lg">
                <p className="text-[#5D4E7B] leading-relaxed">{aiAdvice}</p>
                <div className="mt-4 text-sm text-[#5D4E7B]/70 italic">
                  Take small consistent steps toward your intention today.
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setIsDialogOpen(false)} className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF]">
              Apply This Wisdom
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
