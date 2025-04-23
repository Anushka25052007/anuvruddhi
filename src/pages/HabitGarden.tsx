
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitPlant } from "@/components/habits/HabitPlant";
import { DailyRitualCircle } from "@/components/habits/DailyRitualCircle";
import { CustomHabits } from "@/components/habits/CustomHabits";
import { Leaf, Check } from "lucide-react";

// Example habits data
const plantableHabits = [
  { id: 1, name: "Plant a Tree", xp: 50, completed: false },
  { id: 2, name: "Reduce Plastic Use", xp: 20, completed: false },
  { id: 3, name: "Compost Food Waste", xp: 15, completed: false },
  { id: 4, name: "Use Public Transport", xp: 30, completed: false },
  { id: 5, name: "Conserve Electricity", xp: 25, completed: false },
];

export default function HabitGarden() {
  const [activeTab, setActiveTab] = useState("garden");
  const [completedHabits, setCompletedHabits] = useState<number[]>([]);
  
  const toggleHabit = (id: number) => {
    if (completedHabits.includes(id)) {
      setCompletedHabits(completedHabits.filter(habitId => habitId !== id));
    } else {
      setCompletedHabits([...completedHabits, id]);
    }
  };
  
  const totalXP = plantableHabits
    .filter(habit => completedHabits.includes(habit.id))
    .reduce((sum, habit) => sum + habit.xp, 0);
    
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">Your Habit Garden</h1>
        <p className="text-gray-600">Grow your sustainable habits and watch your garden flourish</p>
        <div className="flex justify-center items-center mt-4 gap-2">
          <Leaf className="h-5 w-5 text-[#7FB069]" />
          <span className="text-xl font-medium">{completedHabits.length} habits completed</span>
          <span className="mx-2">•</span>
          <span className="text-xl font-medium">{totalXP} XP earned</span>
        </div>
      </div>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="mx-auto max-w-4xl"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="garden">Garden</TabsTrigger>
          <TabsTrigger value="rituals">Daily Rituals</TabsTrigger>
          <TabsTrigger value="custom">Custom Habits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="garden" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plantableHabits.map((habit) => (
              <HabitPlant
                key={habit.id}
                name={habit.name}
                xp={habit.xp}
                completed={completedHabits.includes(habit.id)}
                onClick={() => toggleHabit(habit.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="rituals" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <DailyRitualCircle 
              title="Morning Gratitude"
              description="Express gratitude for nature and reflect on how you can contribute today"
              completionTime="Morning"
              isCompleted={false}
            />
            <DailyRitualCircle 
              title="Mindful Consumption"
              description="Pay attention to your resource usage throughout the day"
              completionTime="Afternoon"
              isCompleted={false}
            />
            <DailyRitualCircle 
              title="Evening Reflection"
              description="Review your eco-friendly actions of the day"
              completionTime="Evening"
              isCompleted={false}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <CustomHabits />
        </TabsContent>
      </Tabs>
    </div>
  );
}
