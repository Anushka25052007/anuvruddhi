
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Search, Sparkles, Moon, Sun, Cloud, Leaf, Heart, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

// Audio tracks for meditation
const meditationTracks = [
  { id: 1, title: "Morning Calm", duration: "10:00", category: "mindfulness", color: "#F97316", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-hazy-after-hours-132.mp3" },
  { id: 2, title: "Deep Relaxation", duration: "15:00", category: "sleep", color: "#9b87f5", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-sleepy-cat-135.mp3" },
  { id: 3, title: "Focused Mind", duration: "8:00", category: "focus", color: "#1EAEDB", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3" },
  { id: 4, title: "Stress Relief", duration: "12:00", category: "anxiety", color: "#D946EF", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-relaxing-in-nature-522.mp3" },
  { id: 5, title: "Nature Sounds", duration: "20:00", category: "nature", color: "#7FB069", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-forest-treasure-138.mp3" },
  { id: 6, title: "Chakra Healing", duration: "18:00", category: "spiritual", color: "#FEC6A1", audioUrl: "https://assets.mixkit.co/music/preview/mixkit-deep-meditation-109.mp3" },
];

const categories = [
  { name: "mindfulness", icon: Sun },
  { name: "sleep", icon: Moon },
  { name: "focus", icon: Sparkles },
  { name: "anxiety", icon: Cloud },
  { name: "nature", icon: Leaf },
  { name: "spiritual", icon: Heart },
];

export default function Meditation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<number | null>(null);

  const filteredTracks = meditationTracks.filter(track => {
    const matchesSearch = 
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? track.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const handlePlayTrack = (trackId: number) => {
    const track = meditationTracks.find(t => t.id === trackId);
    
    if (!track) return;
    
    if (currentTrack === trackId) {
      // Toggle play/pause for current track
      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause();
          if (progressInterval.current) {
            window.clearInterval(progressInterval.current);
            progressInterval.current = null;
          }
        } else {
          audioRef.current.play();
          startProgressTracking();
        }
        setIsPlaying(!isPlaying);
      }
    } else {
      // Switch to a new track
      if (audioRef.current) {
        audioRef.current.pause();
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
      }
      
      setCurrentTrack(trackId);
      setIsPlaying(true);
      
      // Create new audio element
      const audio = new Audio(track.audioUrl);
      audio.volume = volume;
      audio.muted = isMuted;
      
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
        if (progressInterval.current) {
          window.clearInterval(progressInterval.current);
          progressInterval.current = null;
        }
        toast.info(`${track.title} has ended`);
      });
      
      audio.addEventListener('error', () => {
        toast.error(`Failed to play ${track.title}. Please try again.`);
        setIsPlaying(false);
      });
      
      audioRef.current = audio;
      audio.play().catch(error => {
        toast.error(`Failed to play audio: ${error.message}`);
        setIsPlaying(false);
      });
      
      startProgressTracking();
    }
  };

  const startProgressTracking = () => {
    if (progressInterval.current) {
      window.clearInterval(progressInterval.current);
    }
    
    setProgress(0);
    progressInterval.current = window.setInterval(() => {
      if (audioRef.current) {
        const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(percent || 0);
      }
    }, 1000);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
    
    if (volumeValue > 0 && isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.muted = false;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || Music;
  };

  const handleCompleteSession = () => {
    toast.success("Meditation completed! +50 XP", {
      description: "Keep up the great mindfulness practice"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E5DEFF] to-[#FFDEE2] relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#9b87f5]/10 blur-3xl"
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
            className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Meditation Space
          </motion.h1>
          <motion.p 
            className="text-[#2D3047]/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Find peace and clarity through guided meditation
          </motion.p>
        </div>

        <motion.div 
          className="relative mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#9b87f5]" />
          <Input
            placeholder="Search by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full border-[#9b87f5]/30 focus:border-[#9b87f5] focus:ring-[#9b87f5]/20 bg-white/80"
          />
        </motion.div>
        
        <div className="mb-6 flex flex-wrap gap-2">
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm backdrop-blur-sm ${
              selectedCategory === null 
                ? 'bg-[#9b87f5] text-white' 
                : 'bg-white/50 text-[#2D3047]'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 backdrop-blur-sm ${
                selectedCategory === category.name 
                  ? 'bg-[#9b87f5] text-white' 
                  : 'bg-white/50 text-[#2D3047]'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.createElement(category.icon, { className: "h-3.5 w-3.5" })}
              <span className="capitalize">{category.name}</span>
            </motion.button>
          ))}
        </div>
        
        {currentTrack && (
          <div className="mb-6 p-3 bg-white/60 backdrop-blur-md rounded-lg flex items-center">
            <div className="flex-grow">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-[#2D3047]">
                  Now Playing: {meditationTracks.find(t => t.id === currentTrack)?.title}
                </span>
                <button onClick={toggleMute} className="p-1">
                  {isMuted ? <VolumeX className="h-4 w-4 text-[#2D3047]/70" /> : <Volume2 className="h-4 w-4 text-[#2D3047]/70" />}
                </button>
              </div>
              <div className="w-full h-1.5 bg-[#9b87f5]/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#9b87f5]" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <Slider 
                  value={[volume]} 
                  max={1} 
                  step={0.01} 
                  onValueChange={handleVolumeChange}
                  className="w-32 mr-4"
                />
                <span className="text-xs text-[#2D3047]/70">{Math.floor(progress * 0.01 * parseInt(meditationTracks.find(t => t.id === currentTrack)?.duration.split(':')[0] || '0'))}:
                  {String(Math.floor((progress * 0.01 * parseInt(meditationTracks.find(t => t.id === currentTrack)?.duration.split(':')[1] || '0')))).padStart(2, '0')} / 
                  {meditationTracks.find(t => t.id === currentTrack)?.duration}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filteredTracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow backdrop-blur-sm bg-white/70 border border-white/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="p-3 rounded-full mr-3" 
                      style={{ backgroundColor: `${track.color}20` }}
                    >
                      {React.createElement(getCategoryIcon(track.category), { 
                        className: "h-5 w-5", 
                        style: { color: track.color } 
                      })}
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2D3047]">{track.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-[#2D3047]/60 mt-1">
                        <Music className="h-3 w-3" />
                        <span>{track.duration}</span>
                        <span className="px-2 py-0.5 rounded-full text-xs capitalize"
                          style={{ backgroundColor: `${track.color}20`, color: track.color }}>
                          {track.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="rounded-full h-10 w-10 flex items-center justify-center"
                    style={{ backgroundColor: track.color }}
                    onClick={() => handlePlayTrack(track.id)}
                  >
                    {currentTrack === track.id && isPlaying ? (
                      <Pause className="h-5 w-5 text-white" />
                    ) : (
                      <Play className="h-5 w-5 text-white" />
                    )}
                  </motion.button>
                </div>
                
                {currentTrack === track.id && isPlaying && (
                  <motion.div 
                    className="mt-3 h-1.5 bg-[#9b87f5]/20 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div 
                      className="h-full" 
                      style={{ backgroundColor: track.color, width: `${progress}%` }}
                    />
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#2D3047]/70 mb-4">Track your daily meditation minutes for XP</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              className="bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 text-white shadow-[0_5px_15px_rgba(155,135,245,0.3)]"
              onClick={handleCompleteSession}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Complete Today's Meditation
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
