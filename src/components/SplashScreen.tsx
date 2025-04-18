
import { ArrowUp, Loader2 } from "lucide-react";

export default function SplashScreen() {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ 
        backgroundImage: "url('/lovable-uploads/d13a7dce-2e2b-4888-a729-8d6f4d36be62.png')",
        backgroundColor: "#1CB5B2" // Fallback color if image doesn't load
      }}
    >
      <div className="flex flex-col items-center justify-center h-full animate-fade-in">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-teal-400/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center">
              <ArrowUp className="h-10 w-10 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-white mt-60 mb-6">
          Anuvruddhi
        </h1>
        
        <div className="flex items-center justify-center text-white/80">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading your wellness journey...</span>
        </div>
      </div>
    </div>
  );
}
