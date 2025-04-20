
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Certificate } from "./Certificate";

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const CertificateModal = ({ open, onOpenChange, userData, achievement }: CertificateModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#0F1D31] to-[#1A1F2C] text-white border-[#9b87f5]/30">
        <Certificate userData={userData} achievement={achievement} />
      </DialogContent>
    </Dialog>
  );
};
