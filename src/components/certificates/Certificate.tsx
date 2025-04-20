
import React, { useRef } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";

interface CertificateProps {
  userData: {
    fullName: string;
    email: string;
    location?: string;
    phoneNo?: string;
    age?: string;
  };
  achievement: {
    name: string;
    xpLevel: number;
    date: string;
  };
}

export const Certificate = ({ userData, achievement }: CertificateProps) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadAsPNG = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${userData.fullName}-Certificate.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadAsPDF = async () => {
    if (certificateRef.current) {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      
      // Calculate ratio to fit certificate on PDF
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const centeredX = (pdfWidth - imgWidth * ratio) / 2;
      const centeredY = (pdfHeight - imgHeight * ratio) / 2;
      
      pdf.addImage(imgData, "PNG", centeredX, centeredY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`${userData.fullName}-Certificate.pdf`);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full mb-6"
        ref={certificateRef}
      >
        <div className="relative rounded-lg overflow-hidden bg-[#0F1D31] text-[#E2D1C3] p-8 border border-[#9b87f5]/30 shadow-[0_0_15px_rgba(155,135,245,0.3)]">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 h-full w-[30%] opacity-30">
              <div className="h-full w-full bg-[url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')] bg-contain bg-no-repeat bg-left" />
            </div>
            <div className="absolute right-0 top-0 h-full w-[30%] opacity-30">
              <div className="h-full w-full bg-[url('/lovable-uploads/a1f630c9-1610-45af-8613-37fe87fdfb8b.png')] bg-contain bg-no-repeat bg-right" />
            </div>
            <div className="absolute inset-0">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 4 + 1}px`,
                    height: `${Math.random() * 4 + 1}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animation: `twinkle ${Math.random() * 5 + 3}s infinite`
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Certificate Content */}
          <div className="relative text-center">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-2 text-[#E2D1C3]">
              ANUVRUDDHI
            </h1>
            <p className="text-[#9b87f5] italic text-xl mb-12">
              Flourish with Nature. Rise with Purpose
            </p>
            
            <div className="mx-auto max-w-3xl border-2 border-[#9b87f5]/40 rounded-lg p-8 bg-[#0A1628]/90 backdrop-blur-sm">
              <h2 className="text-4xl font-serif font-bold mb-10 text-[#E2D1C3]">
                CERTIFICATE
                <br />
                OF ACHIEVEMENT
              </h2>
              
              <div className="space-y-6 mb-6">
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Full Name</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {userData.fullName}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Age</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {userData.age || ""}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Email</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {userData.email}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Phone No</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {userData.phoneNo || ""}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Location</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {userData.location || ""}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Achievement</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {achievement.name}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">XP Level</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {achievement.xpLevel}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 items-center">
                  <p className="text-left text-xl">Date</p>
                  <div className="col-span-2 border-b-2 border-[#9b87f5]/30 text-left pl-2 py-1">
                    {achievement.date}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <div className="w-32 h-20 opacity-40 bg-contain bg-no-repeat bg-center" style={{ backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAsOTAgQzMwLDMwIDc1LDIwIDEyMCw4MCBTMTc1LDMwIDE5MCw5MCIgc3Ryb2tlPSIjOWI4N2Y1IiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=")' }} />
              </div>
              <p className="text-center text-sm italic mt-2">Authorized Signature</p>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="flex space-x-4 mb-10">
        <Button 
          onClick={downloadAsPNG} 
          variant="outline" 
          className="bg-[#1A1F2C] text-white border-[#9b87f5] hover:bg-[#9b87f5] hover:text-[#0F1D31]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PNG
        </Button>
        <Button 
          onClick={downloadAsPDF}
          className="bg-[#9b87f5] text-[#0F1D31] hover:bg-[#7E69AB]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <Button 
          variant="outline"
          className="border-[#9b87f5] text-white hover:bg-[#1A1F2C]"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Anuvruddhi Certificate',
                text: `Check out my achievement: ${achievement.name}!`,
                url: window.location.href,
              });
            }
          }}
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
