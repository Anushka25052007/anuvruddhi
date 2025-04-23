
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Music, Play, Pause, Search } from "lucide-react";

const meditationTracks = [
  { id: 1, title: "Morning Calm", duration: "10:00", category: "mindfulness" },
  { id: 2, title: "Deep Relaxation", duration: "15:00", category: "sleep" },
  { id: 3, title: "Focused Mind", duration: "8:00", category: "focus" },
  { id: 4, title: "Stress Relief", duration: "12:00", category: "anxiety" },
  { id: 5, title: "Nature Sounds", duration: "20:00", category: "nature" },
  { id: 6, title: "Chakra Healing", duration: "18:00", category: "spiritual" },
];

export default function Meditation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTrack, setCurrentTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTracks = meditationTracks.filter(track => 
    track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    track.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePlayTrack = (trackId: number) => {
    if (currentTrack === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(trackId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#2D3047] mb-2">Meditation Space</h1>
        <p className="text-gray-600">Find peace and clarity through guided meditation</p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 w-full"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTracks.map((track) => (
          <Card key={track.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">{track.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Music className="h-3 w-3" />
                  <span>{track.duration}</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs capitalize">
                    {track.category}
                  </span>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-10 w-10 bg-[#7FB069] text-white hover:bg-[#6A9957]"
                onClick={() => handlePlayTrack(track.id)}
              >
                {currentTrack === track.id && isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">Track your daily meditation minutes for XP</p>
        <Button className="mt-4 bg-[#7FB069] hover:bg-[#6A9957]">
          Complete Today's Meditation
        </Button>
      </div>
    </div>
  );
}
