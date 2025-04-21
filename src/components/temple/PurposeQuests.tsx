
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Compass, Diamond, Timer, Heart, Sparkles } from "lucide-react";

interface PurposeQuestsProps {
  totalXp: number;
}

export function PurposeQuests({ totalXp }: PurposeQuestsProps) {
  // Generate quests based on XP level
  const generateQuests = () => {
    const baseQuests = [
      {
        id: 1,
        title: "7-Day Digital Detox",
        description: "Reduce screen time by 30% for one week",
        duration: "7 days",
        progress: 42,
        difficulty: "Medium",
        reward: "Clarity Gem",
        icon: Timer,
        color: "text-[#9b87f5]",
        bgColor: "bg-[#9b87f5]/20",
      },
      {
        id: 2,
        title: "Gratitude Journey",
        description: "Write down 3 things you're grateful for each day",
        duration: "5 days",
        progress: 60,
        difficulty: "Easy",
        reward: "Heart Gem",
        icon: Heart,
        color: "text-[#D946EF]",
        bgColor: "bg-[#D946EF]/20",
      },
      {
        id: 3,
        title: "Mindful Silence",
        description: "Practice 15 minutes of silence daily",
        duration: "3 days",
        progress: 0,
        difficulty: "Hard",
        reward: "Wisdom Gem",
        icon: Sparkles,
        color: "text-[#1EAEDB]",
        bgColor: "bg-[#1EAEDB]/20",
      }
    ];
    
    // Advanced quests unlocked at higher XP levels
    const advancedQuests = [
      {
        id: 4,
        title: "Nature Immersion",
        description: "Spend 30 minutes in nature daily without devices",
        duration: "7 days",
        progress: 14,
        difficulty: "Medium",
        reward: "Rare Earth Gem",
        icon: Compass,
        color: "text-[#7FB069]",
        bgColor: "bg-[#7FB069]/20",
      },
      {
        id: 5,
        title: "Compassion Challenge",
        description: "Perform one random act of kindness daily",
        duration: "10 days",
        progress: 0,
        difficulty: "Hard",
        reward: "Legendary Love Gem",
        icon: Heart,
        color: "text-[#D946EF]",
        bgColor: "bg-[#D946EF]/20",
      }
    ];
    
    // Return all quests if XP is high enough, otherwise just basic quests
    return totalXp >= 150 ? [...baseQuests, ...advancedQuests] : baseQuests;
  };
  
  const quests = generateQuests();

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Compass className="h-5 w-5 text-[#1EAEDB] mr-2" />
          <h3 className="text-lg font-medium text-[#1EAEDB]">Purpose Quests</h3>
        </div>
        <Badge variant="outline" className="bg-[#1EAEDB]/10 text-[#1EAEDB] border-[#1EAEDB]/30">
          Weekly
        </Badge>
      </div>
      
      <div className="space-y-4">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            className="p-4 rounded-md bg-[#1E2333] border border-[#9b87f5]/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className={`p-2 rounded-full ${quest.bgColor} mr-3`}>
                  <quest.icon className={`h-4 w-4 ${quest.color}`} />
                </div>
                <div>
                  <h4 className="font-medium text-white">{quest.title}</h4>
                  <p className="text-xs text-white/50">{quest.duration} • {quest.difficulty}</p>
                </div>
              </div>
              <Badge variant="outline" className={`${quest.bgColor} ${quest.color} border-none`}>
                <Diamond className="h-3 w-3 mr-1" /> 
                {quest.reward}
              </Badge>
            </div>
            
            <p className="text-sm text-white/70 ml-11 mb-3">{quest.description}</p>
            
            <div className="flex items-center justify-between ml-11">
              <div className="w-2/3 flex items-center">
                <Progress value={quest.progress} className="h-2 bg-white/10 flex-1" />
                <span className="text-xs text-white/50 ml-2">{quest.progress}%</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className={`text-xs ${quest.color} hover:${quest.bgColor} border-${quest.color}/30`}
              >
                {quest.progress > 0 ? "Continue" : "Begin"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
