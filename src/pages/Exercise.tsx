
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exerciseCategories = [
  {
    name: "Yoga",
    exercises: [
      { name: "Sun Salutation", duration: "10 mins", level: "Beginner" },
      { name: "Warrior Sequence", duration: "15 mins", level: "Intermediate" },
      { name: "Balance Flow", duration: "20 mins", level: "Advanced" }
    ]
  },
  {
    name: "Cardio",
    exercises: [
      { name: "Quick HIIT", duration: "10 mins", level: "Beginner" },
      { name: "Interval Training", duration: "20 mins", level: "Intermediate" },
      { name: "Endurance Run", duration: "30 mins", level: "Advanced" }
    ]
  },
  {
    name: "Strength",
    exercises: [
      { name: "Bodyweight Basics", duration: "15 mins", level: "Beginner" },
      { name: "Core Power", duration: "20 mins", level: "Intermediate" },
      { name: "Full Body Strength", duration: "25 mins", level: "Advanced" }
    ]
  }
];

export default function Exercise() {
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  const handleCompleteExercise = (exerciseName: string) => {
    if (completedExercises.includes(exerciseName)) {
      setCompletedExercises(completedExercises.filter(name => name !== exerciseName));
    } else {
      setCompletedExercises([...completedExercises, exerciseName]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#2D3047] mb-2">Exercise Hub</h1>
        <p className="text-gray-600">Build strength and vitality through regular exercise</p>
      </div>

      <Tabs defaultValue={exerciseCategories[0].name.toLowerCase()} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          {exerciseCategories.map(category => (
            <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {exerciseCategories.map(category => (
          <TabsContent key={category.name} value={category.name.toLowerCase()}>
            <div className="grid gap-4">
              {category.exercises.map(exercise => (
                <Card key={exercise.name} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{exercise.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span>{exercise.duration}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                          {exercise.level}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant={completedExercises.includes(exercise.name) ? "default" : "outline"}
                      className={completedExercises.includes(exercise.name) ? "bg-[#7FB069]" : ""}
                      onClick={() => handleCompleteExercise(exercise.name)}
                    >
                      {completedExercises.includes(exercise.name) ? "Completed" : "Complete"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Today's Progress</h3>
        <div className="flex justify-between items-center">
          <span>{completedExercises.length} exercises completed</span>
          <span>{completedExercises.length * 10} XP earned</span>
        </div>
      </div>
    </div>
  );
}
