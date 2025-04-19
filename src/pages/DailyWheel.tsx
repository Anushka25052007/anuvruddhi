
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Sparkles, Bird } from "lucide-react";
import { ParticleEffect } from "@/components/motivation/ParticleEffect";
import { ForestWheel } from "@/components/motivation/ForestWheel";

export default function DailyWheel() {
  const [intention, setIntention] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);

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
      toast.success(`You received: ${reward}`, {
        description: "May this gift guide your journey today",
      });
    }, 3000);
  };

  const handleSetIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intention.trim()) return;
    
    toast.success("Daily intention set!", {
      description: "Your focus word will guide your path today",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] relative overflow-hidden">
      <ParticleEffect />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-[#2D3047] mb-2">
            Daily Wisdom Wheel
          </h1>
          <p className="text-[#8E9196]">Spin to receive nature's guidance</p>
        </motion.div>

        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-8">
          <form onSubmit={handleSetIntention} className="space-y-4">
            <label
              htmlFor="intention"
              className="block text-sm font-medium text-[#2D3047]"
            >
              Set Today's Intention
            </label>
            <div className="flex gap-2">
              <Input
                id="intention"
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                placeholder="Enter a word or phrase to focus on..."
                className="flex-1"
              />
              <Button type="submit" className="bg-[#7FB069] hover:bg-[#6B9A57]">
                <Bird className="mr-2" />
                Set
              </Button>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center justify-center">
          <ForestWheel isSpinning={isSpinning} />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8"
          >
            <Button
              onClick={handleSpin}
              disabled={isSpinning}
              size="lg"
              className="bg-[#7FB069] hover:bg-[#6B9A57] text-white px-8 py-6 rounded-full text-lg"
            >
              <Sparkles className="mr-2" />
              Spin the Wheel
            </Button>
          </motion.div>

          {selectedReward && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <span className="text-[#2D3047] font-medium">{selectedReward}</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
