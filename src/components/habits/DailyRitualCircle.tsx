
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Clock } from "lucide-react";

interface DailyRitualCircleProps {
  title: string;
  description: string;
  completionTime: string;
  isCompleted: boolean;
}

export function DailyRitualCircle({ 
  title,
  description,
  completionTime,
  isCompleted
}: DailyRitualCircleProps) {
  return (
    <Card className="p-5 bg-white/80 backdrop-blur-sm border-2 hover:border-[#7FB069] transition-all">
      <div className="flex flex-col items-center text-center gap-4">
        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${
          isCompleted ? "border-[#7FB069] bg-[#F2FCE2]" : "border-dashed border-gray-300"
        }`}>
          {isCompleted ? (
            <Check className="h-10 w-10 text-[#7FB069]" />
          ) : (
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
          <div className="mt-2 text-xs text-gray-500">Best time: {completionTime}</div>
        </div>
        
        <Button 
          variant={isCompleted ? "default" : "outline"}
          className={isCompleted ? "bg-[#7FB069] hover:bg-[#6A9957] w-full" : "w-full"}
        >
          {isCompleted ? "Completed" : "Mark Complete"}
        </Button>
      </div>
    </Card>
  );
}
