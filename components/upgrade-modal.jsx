import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function UpgradeModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
          <DialogDescription>
            Unlock exclusive features and premium support.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-4">
            <p>Pro plan features coming soon!</p>
            <Button className="w-full bg-linear-to-r from-pink-500 to-orange-500 text-white font-bold">
                Get Pro
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
