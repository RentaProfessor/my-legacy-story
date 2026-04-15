import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Users } from "lucide-react";

type Step = "whose" | "name" | "familyCode" | "device";

const RecordFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "book";

  const [step, setStep] = useState<Step>("whose");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [familyCode, setFamilyCode] = useState("");

  const title = type === "book" ? "Record a Book" : "Record a Journal";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <button
          onClick={() => {
            if (step === "whose") navigate(-1);
            else if (step === "name") setStep("whose");
            else if (step === "familyCode") setStep("name");
            else if (step === "device") setStep("familyCode");
          }}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        {step === "whose" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground">Whose story would you like to record?</p>
            </div>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-14 text-base justify-start gap-4"
                onClick={() => setStep("name")}
              >
                <User className="!size-5 text-primary" /> Mine
              </Button>
              <Button
                variant="outline"
                className="w-full h-14 text-base justify-start gap-4"
                onClick={() => setStep("name")}
              >
                <Users className="!size-5 text-primary" /> Someone Else's
              </Button>
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Your Info</h1>
              <p className="text-muted-foreground">Tell us a bit about yourself.</p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 text-base"
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-12 text-base"
              />
              <Button
                className="w-full h-12 text-base"
                disabled={!name.trim() || !dob}
                onClick={() => setStep("familyCode")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "familyCode" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Family Code</h1>
              <p className="text-muted-foreground">
                Create a family code so loved ones can follow along with your story.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Create a Family Code"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                className="h-12 text-base"
              />
              <Button
                className="w-full h-12 text-base"
                disabled={!familyCode.trim()}
                onClick={() => setStep("device")}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "device" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Connect a Device</h1>
              <p className="text-muted-foreground">
                Would you like to connect a LegacyTape recorder device?
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full h-12 text-base"
                onClick={() => navigate("/device-setup")}
              >
                Connect a Device
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => navigate("/creator-home", { state: { name } })}
              >
                Skip for Now
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-base text-primary"
                onClick={() => window.open("https://mylegacytape.com", "_blank")}
              >
                Purchase a Device
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordFlow;
