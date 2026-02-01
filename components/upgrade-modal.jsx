import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React from "react";
import { Sparkles } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
export default function UpgradeModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl bg-black/95 border-white/10 text-white p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500/20" />
              <DialogTitle className="text-xl">Upgrade to Pro</DialogTitle>
            </div>
            <DialogDescription className="text-gray-400">
              Create Unlimited Events with Pro! Unlock unlimited events and
              premium features!
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-2">
           <PricingTable
            mode="modal"
            appearance={{
              variables: {
                colorPrimary: "#a855f7",
                colorText: "white",
                colorBackground: "#09090b",
                colorInputText: "white",
                colorInputBackground: "#27272a",
              },
              elements: {
                card: "bg-white/5 border border-white/10 hover:bg-white/10 transition-colors",
                headerTitle: "text-white",
                headerSubtitle: "text-gray-400",
                submitButton: "bg-white text-black hover:bg-gray-200 font-semibold",
                pricingPageBackground: "bg-transparent",
              },
            }}
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
              },
            }}
          />
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => onClose(false)}
            >
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
