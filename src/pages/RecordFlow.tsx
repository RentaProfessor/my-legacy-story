import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import SkyBackground from "@/components/SkyBackground";

type Step = "whose" | "name" | "familyCode" | "device";

const RecordFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "book";

  const [step, setStep] = useState<Step>("whose");
  const [whose, setWhose] = useState<"mine" | "other" | null>(null);
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
    <div className="relative flex min-h-[100dvh] flex-col px-6 safe-top safe-bottom">
      <SkyBackground />

      {/* Top bar */}
      <div className="pt-14 pb-2 flex items-center justify-between">
        <button onClick={goBack} className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity -ml-1">
          <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
        </button>
        <span className="text-xs text-muted-foreground font-medium bg-card/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/50">
          Step {stepNumber} of 4
        </span>
      </div>

      {/* Title area */}
      {step === "whose" && (
        <>
          <div className="pt-6 pb-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">Whose story would you like to record?</p>
          </div>
          <div className="w-full max-w-sm mx-auto space-y-3 mt-6">
            {[
              { key: "mine" as const, label: "Mine", desc: "Record your own story", icon: User },
              { key: "other" as const, label: "Someone Else's", desc: "Help capture a loved one's story", icon: Users },
            ].map((opt) => (
              <button
                key={opt.key}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-2xl backdrop-blur-sm border text-left active:opacity-80 transition-all shadow-sm",
                  whose === opt.key
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-card/80"
                )}
                onClick={() => setWhose(opt.key)}
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
          <div className="flex-1 min-h-8" />
          <div className="w-full max-w-sm mx-auto pb-10">
            <Button className="w-full h-13 text-base rounded-xl font-semibold" disabled={!whose} onClick={() => setStep("name")}>
              Continue
            </Button>
          </div>
        </>
      )}

      {step === "name" && (
        <>
          <div className="pt-6 pb-2">
            <h1 className="text-3xl font-bold text-foreground">About You</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">Tell us a little about yourself.</p>
          </div>
          <div className="w-full max-w-sm mx-auto space-y-4 mt-6">
            <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="h-13 text-[16px] rounded-xl bg-card/80 backdrop-blur-sm px-4" />
            <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-13 text-[16px] rounded-xl bg-card/80 backdrop-blur-sm px-4" />
          </div>
          <div className="flex-1 min-h-8" />
          <div className="w-full max-w-sm mx-auto pb-10">
            <Button className="w-full h-13 text-base rounded-xl font-semibold" disabled={!name.trim() || !dob} onClick={() => setStep("familyCode")}>
              Continue
            </Button>
          </div>
        </>
      )}

      {step === "familyCode" && (
        <>
          <div className="pt-6 pb-2">
            <h1 className="text-3xl font-bold text-foreground">Family Code</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">Create a code so loved ones can follow along with your story as it grows.</p>
          </div>
          <div className="w-full flex justify-center mt-6">
            <InputOTP maxLength={6} value={familyCode} onChange={(val) => setFamilyCode(val)}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <div className="flex-1 min-h-8" />
          <div className="w-full max-w-sm mx-auto pb-10">
            <Button className="w-full h-13 text-base rounded-xl font-semibold" disabled={!familyCode.trim()} onClick={() => setStep("device")}>
              Continue
            </Button>
          </div>
        </>
      )}

      {step === "device" && (
        <>
          <div className="pt-6 pb-2">
            <h1 className="text-3xl font-bold text-foreground">Connect a Device</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed mt-2">Record with our retro cassette device or skip and use just the app.</p>
          </div>
          <div className="flex-1 min-h-8" />
          <div className="w-full max-w-sm mx-auto space-y-3 pb-10">
            <Button className="w-full h-13 text-base rounded-xl font-semibold" onClick={() => navigate("/device-setup")}>
              Connect a Device
            </Button>
            <Button variant="outline" className="w-full h-13 text-base rounded-xl font-semibold" onClick={() => navigate("/creator-home", { state: { name } })}>
              Skip for Now
            </Button>
            <Button variant="ghost" className="w-full h-12 text-base text-primary font-semibold" onClick={() => window.open("https://mylegacytape.com", "_blank")}>
              Purchase a Device →
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RecordFlow;
