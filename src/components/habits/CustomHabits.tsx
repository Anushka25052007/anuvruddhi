
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
  completed: boolean;
  isCustom: boolean;
}

export function CustomHabits() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: "Carry reusable bag",
      description: "Bring your own bag for shopping instead of using plastic bags",
      frequency: "Daily",
      completed: false,
      isCustom: true,
    },
    {
      id: 2,
      name: "Conserve water",
      description: "Turn off taps when not in use, take shorter showers",
      frequency: "Daily",
      completed: false,
      isCustom: true,
    }
  ]);

  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    frequency: "Daily"
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit: Habit = {
      id: Date.now(),
      name: newHabit.name,
      description: newHabit.description,
      frequency: newHabit.frequency,
      completed: false,
      isCustom: true
    };

    setHabits([...habits, habit]);
    setNewHabit({ name: "", description: "", frequency: "Daily" });
    setIsDialogOpen(false);
  };

  const toggleHabitCompletion = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Your Custom Eco-Habits</h3>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#7FB069] hover:bg-[#6A9957]">
              <Plus className="h-4 w-4 mr-1" /> Add Habit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Eco-Habit</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              <div>
                <label className="text-sm font-medium block mb-1">Habit Name</label>
                <Input 
                  placeholder="e.g., Reduce plastic waste" 
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Description</label>
                <Textarea 
                  placeholder="What does this habit involve?" 
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Frequency</label>
                <select 
                  className="w-full border rounded-md px-3 py-2"
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({...newHabit, frequency: e.target.value})}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button 
                className="bg-[#7FB069] hover:bg-[#6A9957]"
                onClick={handleAddHabit}
              >
                Create Habit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {habits.map(habit => (
          <Card key={habit.id} className={`p-4 ${habit.completed ? 'bg-gray-50' : ''}`}>
            <div className="flex items-start gap-3">
              <Checkbox 
                checked={habit.completed}
                onCheckedChange={() => toggleHabitCompletion(habit.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <h4 className={`font-medium ${habit.completed ? 'line-through text-gray-500' : ''}`}>
                  {habit.name}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                <div className="text-xs text-gray-500 mt-2">Frequency: {habit.frequency}</div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => deleteHabit(habit.id)}
                className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
        
        {habits.length === 0 && (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <p className="text-gray-500">You haven't added any custom habits yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
