
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Check, Play, Pause, Search, Brain, Library, StarIcon } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StudySession {
  id: number;
  subject: string;
  duration: number;
  completed: boolean;
}

const subjectCategories = [
  {
    name: "Academic",
    subjects: ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "Literature"]
  },
  {
    name: "Advanced",
    subjects: ["Astronomy", "Psychology", "Physiology", "Philosophy", "Economics", "Computer Science"]
  },
  {
    name: "Environmental",
    subjects: ["Environmental Science", "Sustainable Development", "Eco-friendly Practices", "Climate Change"]
  }
];

export default function Study() {
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    { id: 1, subject: "Environmental Science", duration: 45, completed: false },
    { id: 2, subject: "Sustainable Development", duration: 30, completed: false },
    { id: 3, subject: "Eco-friendly Practices", duration: 60, completed: false },
  ]);
  
  const [newSubject, setNewSubject] = useState("");
  const [newDuration, setNewDuration] = useState(30);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSession, setActiveSession] = useState<number | null>(null);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [subjectContent, setSubjectContent] = useState("");
  
  const timerRef = useRef<number | null>(null);

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
    
    toast.success("Study session added", {
      description: `${newSubject} added to your study plan`
    });
  };

  const toggleSessionCompletion = (id: number) => {
    setStudySessions(studySessions.map(session => 
      session.id === id ? { ...session, completed: !session.completed } : session
    ));
    
    const session = studySessions.find(s => s.id === id);
    if (session && !session.completed) {
      toast.success(`${session.subject} completed! +${Math.floor(session.duration / 15) * 5} XP`);
    }
  };

  const startStudySession = (id: number) => {
    const session = studySessions.find(s => s.id === id);
    if (!session) return;
    
    // Stop previous timer if exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setActiveSession(id);
    setTimeRemaining(session.duration * 60);
    setSessionRunning(true);
    
    // Start timer
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Session complete
          clearInterval(timerRef.current!);
          setSessionRunning(false);
          toggleSessionCompletion(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    toast.info(`Started ${session.subject} session for ${session.duration} minutes`);
  };

  const pauseStudySession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setSessionRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleQuickSubjectAdd = (subject: string) => {
    setNewSubject(subject);
  };
  
  const handleContentSearch = (subject: string) => {
    setSelectedSubject(subject);
    setContentLoading(true);
    setShowContentDialog(true);
    
    // Simulate API call to get content
    setTimeout(() => {
      setContentLoading(false);
      setSubjectContent(`
        # Introduction to ${subject}
        
        This is a brief overview of ${subject}, a fascinating field of study that combines various disciplines and approaches.
        
        ## Key Concepts
        
        1. The fundamental principles of ${subject} include...
        2. Historical development and major figures
        3. Modern applications and future directions
        
        ## Learning Resources
        
        - Online courses from leading universities
        - Key textbooks and reference materials
        - Practice exercises and problems
        
        Learn more by exploring these topics in depth. Happy studying!
      `);
    }, 1500);
  };

  const totalXP = studySessions
    .filter(session => session.completed)
    .reduce((total, session) => total + Math.floor(session.duration / 15) * 5, 0);

  const filteredSessions = studySessions.filter(session =>
    session.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ea384c]/20 to-[#9F9EA1]/20 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#ea384c]/10 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <motion.div
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#D946EF]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          y: [0, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="container mx-auto p-6 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl font-bold text-[#2D3047] mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Study Space
          </motion.h1>
          <p className="text-gray-600">Expand your knowledge in any subject</p>
        </div>

        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm">
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
            <Button onClick={handleAddSession} className="bg-[#ea384c] hover:bg-[#d43344]">
              Add Session
            </Button>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Quick Add Subjects:</p>
            <div className="flex flex-wrap gap-2">
              <Tabs defaultValue="academic">
                <TabsList>
                  {subjectCategories.map(category => (
                    <TabsTrigger key={category.name} value={category.name.toLowerCase()}>
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {subjectCategories.map(category => (
                  <TabsContent key={category.name} value={category.name.toLowerCase()}>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {category.subjects.map(subject => (
                        <Button 
                          key={subject} 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleQuickSubjectAdd(subject)}
                          className="text-xs"
                        >
                          {subject}
                        </Button>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
        </Card>

        <div className="mb-4 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search sessions..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="grid gap-4">
          {filteredSessions.map(session => (
            <Card key={session.id} className={`p-4 ${session.completed ? 'bg-gray-50' : 'bg-white/80 backdrop-blur-sm'}`}>
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <BookOpen className={`h-5 w-5 ${session.completed ? 'text-[#ea384c]' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="font-medium">{session.subject}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{session.duration} minutes</span>
                      <span className="text-xs text-[#ea384c] ml-2">
                        ({Math.floor(session.duration / 15) * 5} XP)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentSearch(session.subject)}
                    className="text-[#9b87f5]"
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    Content
                  </Button>
                  
                  {activeSession === session.id && sessionRunning ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{formatTime(timeRemaining)}</span>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={pauseStudySession}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : session.completed ? (
                    <Button 
                      variant="default"
                      className="bg-[#ea384c]"
                      onClick={() => toggleSessionCompletion(session.id)}
                    >
                      <Check className="mr-1 h-4 w-4" /> Completed
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      onClick={() => startStudySession(session.id)}
                    >
                      <Play className="mr-1 h-4 w-4" /> Start
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {filteredSessions.length === 0 && (
            <div className="text-center p-8 bg-white/50 rounded-lg">
              <Library className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No study sessions found</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-white/70 backdrop-blur-sm rounded-lg">
          <h3 className="font-medium mb-2 flex items-center">
            <StarIcon className="h-5 w-5 mr-2 text-[#ea384c]" />
            Study Progress
          </h3>
          <div className="flex justify-between items-center">
            <span>{studySessions.filter(s => s.completed).length} of {studySessions.length} sessions completed</span>
            <span className="font-medium text-[#ea384c]">{totalXP} XP earned</span>
          </div>
          
          <div className="mt-2 w-full bg-gray-200 h-2 rounded-full">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#ea384c] to-[#D946EF]"
              initial={{ width: "0%" }}
              animate={{ 
                width: studySessions.length > 0 
                  ? `${(studySessions.filter(s => s.completed).length / studySessions.length) * 100}%` 
                  : "0%" 
              }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </div>
      
      {/* Study Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="bg-white/95 backdrop-blur-lg max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-[#ea384c]" />
              {selectedSubject} Study Content
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 max-h-[60vh] overflow-y-auto">
            {contentLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <motion.div
                  className="h-12 w-12 rounded-full border-4 border-t-[#ea384c] border-r-transparent border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="mt-4 text-gray-600">Loading content...</p>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="p-4 bg-gray-50 rounded-lg">
                  {subjectContent.split('\n').map((line, i) => {
                    if (line.startsWith('# ')) {
                      return <h1 key={i} className="text-xl font-bold my-2">{line.replace('# ', '')}</h1>;
                    } else if (line.startsWith('## ')) {
                      return <h2 key={i} className="text-lg font-semibold my-2">{line.replace('## ', '')}</h2>;
                    } else if (line.startsWith('- ')) {
                      return <li key={i}>{line.replace('- ', '')}</li>;
                    } else if (line.trim() === '') {
                      return <br key={i} />;
                    } else {
                      return <p key={i}>{line}</p>;
                    }
                  })}
                </div>
                
                <div className="mt-4 p-4 bg-[#ea384c]/10 rounded-lg">
                  <h3 className="font-medium text-[#ea384c]">AI-Powered Learning</h3>
                  <p className="text-sm mt-2">
                    This is a preview of AI-generated study content. For more comprehensive materials, consider connecting the app to an AI service.
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContentDialog(false)}>
              Close
            </Button>
            <Button 
              className="bg-gradient-to-r from-[#ea384c] to-[#D946EF]"
              onClick={() => {
                setShowContentDialog(false);
                toast.success("Study content saved to your notes");
              }}
            >
              Save to Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
