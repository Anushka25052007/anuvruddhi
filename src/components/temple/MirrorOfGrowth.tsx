
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Sparkles, LineChart, Heart, Brain, Leaf } from "lucide-react";

interface MirrorOfGrowthProps {
  totalXp: number;
  userData: any;
}

export function MirrorOfGrowth({ totalXp, userData }: MirrorOfGrowthProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    // Update current date once when component mounts
    setCurrentDate(new Date());
  }, []);
  
  // Get formatted date for mirror
  const formattedDate = currentDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  // Generate insights based on XP level
  const getInsights = () => {
    const insights = [];
    
    // Basic insights for everyone
    insights.push({
      title: "Consistency Pattern",
      description: "You've been showing remarkable consistency in your daily practices.",
      icon: LineChart,
      color: "text-[#1EAEDB]",
    });
    
    // Add insights based on XP milestones
    if (totalXp >= 50) {
      insights.push({
        title: "Kindness Recognition",
        description: "Your compassionate actions are creating positive ripples around you.",
        icon: Heart,
        color: "text-[#D946EF]",
      });
    }
    
    if (totalXp >= 100) {
      insights.push({
        title: "Mindful Awareness",
        description: "Your practice of presence is deepening your connection to each moment.",
        icon: Brain,
        color: "text-[#9b87f5]",
      });
    }
    
    if (totalXp >= 200) {
      insights.push({
        title: "Growth Momentum",
        description: "You've established a powerful momentum toward your highest potential.",
        icon: Leaf,
        color: "text-[#7FB069]",
      });
    }
    
    return insights;
  };
  
  // Weekly quote based on XP level
  const getWeeklyQuote = () => {
    const quotes = [
      "The journey of a thousand miles begins with a single step.",
      "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
      "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
      "The wound is the place where the Light enters you.",
      "What you seek is seeking you.",
      "Be a lamp, or a lifeboat, or a ladder. Help someone's soul heal.",
    ];
    
    // Select quote based on XP level (simplified approach)
    const index = Math.min(Math.floor(totalXp / 50), quotes.length - 1);
    return quotes[index];
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1E2333] to-[#252A3D] p-5 border border-[#9b87f5]/10">
        <div className="mb-4 flex items-center">
          <Sparkles className="h-5 w-5 text-[#9b87f5] mr-2" />
          <h3 className="text-lg font-medium text-[#9b87f5]">Weekly Reflection</h3>
        </div>
        
        <p className="text-sm text-white/70 mb-4">For the week of {formattedDate}</p>
        
        <motion.div
          className="p-4 rounded-md bg-[#0F1D31]/70 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="italic text-white/90 text-sm">"{getWeeklyQuote()}"</p>
        </motion.div>
        
        <div className="space-y-4">
          {getInsights().map((insight, index) => (
            <motion.div
              key={index}
              className="flex items-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className={`p-2 rounded-full bg-white/10 ${insight.color} mr-3`}>
                <insight.icon className="h-4 w-4" />
              </div>
              <div>
                <h4 className={`text-sm font-medium ${insight.color} mb-1`}>{insight.title}</h4>
                <p className="text-sm text-white/70">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <Card className="bg-gradient-to-br from-[#1E2333] to-[#252A3D] border-[#9b87f5]/10 p-4">
        <h3 className="text-sm font-medium text-[#1EAEDB] mb-2">Personal Growth Insights</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7FB069] mr-2"></div>
            <span className="text-white/80">Your consciousness expands with each mindful action</span>
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#9b87f5] mr-2"></div>
            <span className="text-white/80">Growth comes through consistent small efforts</span>
          </li>
          <li className="flex items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#D946EF] mr-2"></div>
            <span className="text-white/80">Honor where you are in your unique journey</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
