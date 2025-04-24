
import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HabitPlant } from "@/components/habits/HabitPlant";
import { DailyRitualCircle } from "@/components/habits/DailyRitualCircle";
import { CustomHabits } from "@/components/habits/CustomHabits";
import { Leaf, Check, Sparkles, Star, Book, Droplet, House, AlarmClock, Waves } from "lucide-react";

// Example habits data with colors
const plantableHabits = [
  { id: 1, name: "Plant a Tree", xp: 50, completed: false, color: "#7FB069" },
  { id: 2, name: "Reduce Plastic Use", xp: 20, completed: false, color: "#1EAEDB" },
  { id: 3, name: "Compost Food Waste", xp: 15, completed: false, color: "#D946EF" },
  { id: 4, name: "Use Public Transport", xp: 30, completed: false, color: "#F97316" },
  { id: 5, name: "Conserve Electricity", xp: 25, completed: false, color: "#9b87f5" },
  { id: 6, name: "Read Books", xp: 35, completed: false, color: "#D946EF" },
  { id: 7, name: "Drink More Water", xp: 20, completed: false, color: "#33C3F0" },
  { id: 8, name: "Do Household Work", xp: 30, completed: false, color: "#FEC6A1" },
  { id: 9, name: "Save Water While Bathing", xp: 25, completed: false, color: "#1EAEDB" },
  { id: 10, name: "Wake Up Early", xp: 40, completed: false, color: "#F97316" },
];

// Updated categories with icons for new habits
const categories = [
  { name: "mindfulness", icon: Star },
  { name: "sleep", icon: AlarmClock },
  { name: "focus", icon: Sparkles },
  { name: "anxiety", icon: Leaf },
  { name: "nature", icon: Leaf },
  { name: "spiritual", icon: Star },
  { name: "reading", icon: Book },
  { name: "hydration", icon: Droplet },
  { name: "household", icon: House },
  { name: "water-saving", icon: Waves },
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
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] relative overflow-hidden">
      {/* Background animated elements */}
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-[#7FB069]/10 blur-3xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1EAEDB]/10 blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="container mx-auto p-6 relative z-10">
        <div className="mb-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img 
              src="/lovable-uploads/7c5f6da8-5d64-4a0a-8ca0-9de8578546e3.png" 
              alt="Habit Garden Logo" 
              className="w-40 h-40 mb-4 object-contain animate-fade-in"
            />
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#7FB069] to-[#1EAEDB] bg-clip-text text-transparent flex justify-center items-center">
              <Sparkles className="mr-3 h-8 w-8 text-[#F97316]" />
              Your Habit Garden
            </h1>
            <p className="text-[#2D3047]/70">Grow your sustainable habits and watch your garden flourish</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center items-center mt-6 gap-4 flex-wrap"
          >
            <Card className="bg-white/80 backdrop-blur-sm border border-[#7FB069]/30 p-4 flex items-center">
              <div className="p-3 rounded-full bg-[#7FB069]/20 mr-3">
                <Leaf className="h-5 w-5 text-[#7FB069]" />
              </div>
              <div>
                <div className="text-sm text-[#2D3047]/70">Habits Completed</div>
                <div className="text-xl font-medium text-[#2D3047]">{completedHabits.length}</div>
              </div>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm border border-[#1EAEDB]/30 p-4 flex items-center">
              <div className="p-3 rounded-full bg-[#1EAEDB]/20 mr-3">
                <Star className="h-5 w-5 text-[#1EAEDB]" />
              </div>
              <div>
                <div className="text-sm text-[#2D3047]/70">XP Earned</div>
                <div className="text-xl font-medium text-[#2D3047]">{totalXP}</div>
              </div>
            </Card>
          </motion.div>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mx-auto max-w-4xl"
        >
          <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
            <TabsTrigger 
              value="garden" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#7FB069]/20 data-[state=active]:to-[#7FB069]/10 data-[state=active]:text-[#7FB069]"
            >
              Garden
            </TabsTrigger>
            <TabsTrigger 
              value="rituals" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#9b87f5]/20 data-[state=active]:to-[#9b87f5]/10 data-[state=active]:text-[#9b87f5]"
            >
              Daily Rituals
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#1EAEDB]/20 data-[state=active]:to-[#1EAEDB]/10 data-[state=active]:text-[#1EAEDB]"
            >
              Custom Habits
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="garden" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {plantableHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border border-white/50 bg-white/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                    <div className="h-2" style={{ backgroundColor: habit.color }}></div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-[#2D3047]">{habit.name}</h3>
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${habit.color}20` }}>
                          <Leaf className="h-4 w-4" style={{ color: habit.color }} />
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#2D3047]/70">+{habit.xp} XP</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            completedHabits.includes(habit.id)
                              ? `bg-[${habit.color}] border-[${habit.color}] text-white`
                              : `border-[${habit.color}80] text-transparent`
                          }`}
                          onClick={() => toggleHabit(habit.id)}
                          style={{ 
                            backgroundColor: completedHabits.includes(habit.id) ? habit.color : "transparent",
                            borderColor: completedHabits.includes(habit.id) ? habit.color : `${habit.color}80`
                          }}
                        >
                          {completedHabits.includes(habit.id) && <Check className="h-4 w-4" />}
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
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
    </div>
  );
}
