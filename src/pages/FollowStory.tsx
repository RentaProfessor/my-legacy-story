import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
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

  // Mock lookup result
  const mockPerson = "Marlene Chiate";

  const handleContinue = () => {
    if (code.trim()) setShowConfirm(true);
  };

  const handleConfirm = () => {
    navigate("/dashboard", { state: { name: mockPerson } });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Follow a Story</h1>
          <p className="text-muted-foreground">
            Enter a family code or last name to find their story.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Family Code / Last Name"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-12 text-base"
            onKeyDown={(e) => e.key === "Enter" && handleContinue()}
          />
          <Button className="w-full h-12 text-base" onClick={handleContinue} disabled={!code.trim()}>
            Continue
          </Button>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>
              Would you like to follow <span className="font-semibold text-foreground">{mockPerson}</span>'s story?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Yes, Follow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FollowStory;
