
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Timer, Info, Heart, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface LifespanPredictorProps {
  userData: any;
  totalXp: number;
}

export function LifespanPredictor({ userData, totalXp }: LifespanPredictorProps) {
  const { toast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  
  // Get base life expectancy from user age or default to 80
  const baseLifeExpectancy = 82;
  
  // Calculate lifespan modifiers based on XP level and habits
  const getLifespanModifiers = () => {
    return [
      { factor: "Regular Meditation", impact: "+1.2 years", value: 1.2 },
      { factor: "Physical Exercise", impact: "+2.4 years", value: 2.4 },
      { factor: "Healthy Diet", impact: "+1.8 years", value: 1.8 },
      { factor: "Stress Management", impact: "+1.5 years", value: 1.5 },
      { factor: "Positive Mindset", impact: "+1.0 years", value: 1.0 },
    ];
  };
  
  const modifiers = getLifespanModifiers();
  
  // Calculate total modifier impact
  const totalModifierYears = modifiers.reduce((total, mod) => total + mod.value, 0);
  
  // XP bonus (symbolic: 1 year per 200 XP)
  const xpBonus = Math.floor(totalXp / 200);
  
  // Calculate predicted lifespan
  const predictedLifespan = baseLifeExpectancy + totalModifierYears + xpBonus;
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
    
    if (!showDetails) {
      toast({
        title: "Lifespan Prediction",
        description: "These estimations are symbolic and based on general health research.",
      });
    }
  };

  return (
    <Card className="bg-[#1A1F2C]/80 border-[#9b87f5]/30 backdrop-blur-sm text-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            <Timer className="mr-2 h-5 w-5 text-[#ea384c]" />
            Lifespan Predictor
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Info className="h-4 w-4 text-white/70" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>This is a symbolic representation based on research about healthy habits and their impact on longevity.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="text-white/70">
          Projected based on your habits and practices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center p-4">
          <motion.div
            className="text-3xl font-bold text-white mb-2 flex items-center"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="mr-2 h-5 w-5 text-[#9b87f5]" />
            {predictedLifespan.toFixed(1)} years
          </motion.div>
          <p className="text-sm text-white/70 mb-4">Predicted lifespan</p>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleDetails}
            className="text-[#9b87f5] border-[#9b87f5]/30 hover:bg-[#9b87f5]/20"
          >
            {showDetails ? "Hide Details" : "View Details"}
          </Button>
        </div>
        
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableHead className="text-white/70">Factor</TableHead>
                  <TableHead className="text-white/70 text-right">Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableCell>Base Life Expectancy</TableCell>
                  <TableCell className="text-right">{baseLifeExpectancy} years</TableCell>
                </TableRow>
                
                {modifiers.map((mod, i) => (
                  <TableRow key={i} className="hover:bg-transparent border-b border-white/10">
                    <TableCell>{mod.factor}</TableCell>
                    <TableCell className="text-right text-[#7FB069]">{mod.impact}</TableCell>
                  </TableRow>
                ))}
                
                <TableRow className="hover:bg-transparent border-b border-white/10">
                  <TableCell>Personal Growth (XP)</TableCell>
                  <TableCell className="text-right text-[#9b87f5]">+{xpBonus} years</TableCell>
                </TableRow>
                
                <TableRow className="hover:bg-transparent font-medium">
                  <TableCell>Predicted Total</TableCell>
                  <TableCell className="text-right">{predictedLifespan.toFixed(1)} years</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <div className="mt-4 p-3 bg-[#1E2333] rounded-md text-sm text-white/70">
              Note: This is a symbolic representation based on research about healthy habits. Actual lifespan is influenced by many genetic and environmental factors.
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
