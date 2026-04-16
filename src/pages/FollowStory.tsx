import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const FollowStory = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const mockPerson = "Marlene Chiate";

  const handleContinue = () => {
    if (code.trim()) setShowConfirm(true);
  };

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-6 safe-top safe-bottom">
      <SkyBackground />

      {/* Back button - fixed top left */}
      <div className="pt-14 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity -ml-1"
        >
          <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
        </button>
      </div>

      {/* Title area */}
      <div className="pt-6 pb-2">
        <h1 className="text-3xl font-bold text-foreground">Follow a Story</h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">
          Enter a family code or last name to find their story.
        </p>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-h-8" />

      {/* Input area toward bottom */}
      <div className="w-full max-w-sm mx-auto space-y-4 pb-10">
        <Input
          placeholder="Family Code / Last Name"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="h-13 text-[16px] rounded-xl bg-card/80 backdrop-blur-sm px-4"
          onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        />
        <Button
          className="w-full h-13 text-base rounded-xl font-semibold"
          onClick={handleContinue}
          disabled={!code.trim()}
        >
          Continue
        </Button>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-[calc(100%-3rem)] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Confirm</DialogTitle>
            <DialogDescription className="text-[15px] leading-relaxed pt-1">
              Would you like to follow <span className="font-semibold text-foreground">{mockPerson}</span>'s story?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-2">
            <Button variant="outline" className="h-12 rounded-xl flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button className="h-12 rounded-xl flex-1" onClick={() => navigate("/dashboard", { state: { name: mockPerson } })}>
              Yes, Follow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowStory;
