
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Check } from "lucide-react";

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  completed: boolean;
}

export default function Study() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    { id: 1, subject: "Environmental Science", duration: 45, completed: false },
    { id: 2, subject: "Sustainable Development", duration: 30, completed: false },
    { id: 3, subject: "Eco-friendly Practices", duration: 60, completed: false },
  ]);
  
  const [newSubject, setNewSubject] = useState("");
  const [newDuration, setNewDuration] = useState(30);

  const handleAddSession = () => {
    if (newSubject.trim() === "") return;
    
    const newSession: StudySession = {
      id: Date.now(),
      subject: newSubject,
      duration: newDuration,
      completed: false
    };
    
    setStudySessions([...studySessions, newSession]);
    setNewSubject("");
    setNewDuration(30);
  };

  const toggleSessionCompletion = (id: number) => {
    setStudySessions(studySessions.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
  };

  const totalXP = studySessions
    .filter(session => session.completed)
    .reduce((total, session) => total + Math.floor(session.duration / 15) * 5, 0);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#2D3047] mb-2">Study Space</h1>
        <p className="text-gray-600">Expand your knowledge about environment and sustainability</p>
      </div>

      <Card className="p-4 mb-6">
        <h3 className="font-medium mb-4">Add New Study Session</h3>
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="flex-1">
            <Input 
              placeholder="Subject/Topic" 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-36">
            <Input 
              type="number" 
              min="5"
              max="180"
              value={newDuration}
              onChange={(e) => setNewDuration(parseInt(e.target.value) || 30)}
            />
          </div>
          <Button onClick={handleAddSession} className="bg-[#7FB069] hover:bg-[#6A9957]">
            Add Session
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {studySessions.map(session => (
          <Card key={session.id} className={`p-4 ${session.completed ? 'bg-gray-50' : ''}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen className={`h-5 w-5 ${session.completed ? 'text-[#7FB069]' : 'text-gray-400'}`} />
                <div>
                  <h3 className="font-medium">{session.subject}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{session.duration} minutes</span>
                    <span className="text-xs text-[#7FB069] ml-2">
                      ({Math.floor(session.duration / 15) * 5} XP)
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant={session.completed ? "default" : "outline"}
                className={session.completed ? "bg-[#7FB069]" : ""}
                onClick={() => toggleSessionCompletion(session.id)}
              >
                {session.completed ? (
                  <>
                    <Check className="mr-1 h-4 w-4" /> Completed
                  </>
                ) : (
                  "Mark Complete"
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Study Progress</h3>
        <div className="flex justify-between items-center">
          <span>{studySessions.filter(s => s.completed).length} of {studySessions.length} sessions completed</span>
          <span>{totalXP} XP earned</span>
        </div>
      </div>
    </div>
  );
}
