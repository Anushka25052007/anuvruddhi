
import React from "react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Heart, Leaf, Brain, Zap } from "lucide-react";

interface LegacyJournalProps {
  totalXp: number;
}

export function LegacyJournal({ totalXp }: LegacyJournalProps) {
  // Generate journal entries based on XP level
  const generateEntries = () => {
    const entries = [];
    
    // One entry per 15 XP (simplified approach)
    const entryCount = Math.floor(totalXp / 15);
    
    const entryTypes = [
      {
        title: "Meditation Complete",
        description: "Found stillness amidst the chaos. Inner peace grows stronger.",
        icon: Brain,
        color: "text-[#9b87f5]",
        bgColor: "bg-[#9b87f5]/20"
      },
      {
        title: "Act of Kindness",
        description: "Extended help to someone in need. Connection deepened.",
        icon: Heart,
        color: "text-[#D946EF]",
        bgColor: "bg-[#D946EF]/20"
      },
      {
        title: "Nature Connection",
        description: "Spent time with trees and sky. Felt part of something greater.",
        icon: Leaf,
        color: "text-[#7FB069]",
        bgColor: "bg-[#7FB069]/20"
      },
      {
        title: "Energetic Practice",
        description: "Body movement generated vital energy. Feeling alive.",
        icon: Zap,
        color: "text-[#1EAEDB]", 
        bgColor: "bg-[#1EAEDB]/20"
      }
    ];
    
    // Generate entries with dates (starting from recent and going backwards)
    for (let i = 0; i < Math.min(entryCount, 20); i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      // Select a random entry type
      const entryType = entryTypes[i % entryTypes.length];
      
      entries.push({
        id: i,
        date: formattedDate,
        ...entryType
      });
    }
    
    return entries;
  };
  
  const entries = generateEntries();

  return (
    <div className="relative">
      <div className="flex items-center mb-4">
        <BookOpen className="h-5 w-5 text-[#7FB069] mr-2" />
        <h3 className="text-lg font-medium text-[#7FB069]">Your Growth Journal</h3>
      </div>
      
      {entries.length === 0 ? (
        <div className="text-center p-8">
          <p className="text-white/70">Complete tasks to begin your journal</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="p-4 rounded-md bg-[#1E2333] border border-[#9b87f5]/10 relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${entry.bgColor} mr-3`}>
                    <entry.icon className={`h-4 w-4 ${entry.color}`} />
                  </div>
                  <h4 className={`font-medium ${entry.color}`}>{entry.title}</h4>
                </div>
                <span className="text-xs text-white/50">{entry.date}</span>
              </div>
              <p className="text-sm text-white/70 ml-11">{entry.description}</p>
              
              {/* Symbolic page corner fold */}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#252A3D] rounded-tl-md"></div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
