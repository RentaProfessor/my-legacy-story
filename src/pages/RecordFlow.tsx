import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Users } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";

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

  const goBack = () => {
    if (step === "whose") navigate(-1);
    else if (step === "name") setStep("whose");
    else if (step === "familyCode") setStep("name");
    else if (step === "device") setStep("familyCode");
  };

  const stepNumber = { whose: 1, name: 2, familyCode: 3, device: 4 }[step];

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-6 pt-16 safe-bottom">
      <SkyBackground />

      <div className="w-full max-w-sm mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors -ml-1"
          >
            <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
          </button>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
            Step {stepNumber} of 4
          </span>
        </div>

        {step === "whose" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Whose story would you like to record?
              </p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Mine", desc: "Record your own story", icon: User },
                { label: "Someone Else's", desc: "Help capture a loved one's story", icon: Users },
              ].map((opt) => (
                <button
                  key={opt.label}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/60 text-left active:scale-[0.98] transition-all hover:border-primary/30 shadow-sm"
                  onClick={() => setStep("name")}
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <opt.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-[15px] text-foreground">{opt.label}</p>
                    <p className="text-[13px] text-muted-foreground">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "name" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">About You</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Tell us a little about yourself.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-13 text-[16px] rounded-xl bg-card/70 backdrop-blur-sm px-4"
              />
              <Input
                type="date"
                placeholder="Date of Birth"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="h-13 text-[16px] rounded-xl bg-card/70 backdrop-blur-sm px-4"
              />
              <Button
                className="w-full h-13 text-base rounded-xl font-semibold"
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
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Create a code so loved ones can follow along with your story as it grows.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="Create a Family Code"
                value={familyCode}
                onChange={(e) => setFamilyCode(e.target.value)}
                className="h-13 text-[16px] rounded-xl bg-card/70 backdrop-blur-sm px-4"
              />
              <Button
                className="w-full h-13 text-base rounded-xl font-semibold"
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
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                Record with our retro cassette device or skip and use just the app.
              </p>
            </div>
            <div className="space-y-3">
              <Button
                className="w-full h-13 text-base rounded-xl font-semibold"
                onClick={() => navigate("/device-setup")}
              >
                Connect a Device
              </Button>
              <Button
                variant="outline"
                className="w-full h-13 text-base rounded-xl font-semibold"
                onClick={() => navigate("/creator-home", { state: { name } })}
              >
                Skip for Now
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-base text-primary font-semibold"
                onClick={() => window.open("https://mylegacytape.com", "_blank")}
              >
                Purchase a Device →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecordFlow;
