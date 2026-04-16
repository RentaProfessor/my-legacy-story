import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";

const DeviceSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-6 safe-top safe-bottom">
      <SkyBackground />

      {/* Back button top left */}
      <div className="pt-14 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity -ml-1">
          <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
        </button>
      </div>

      {/* Title area */}
      <div className="pt-6 pb-2 text-center">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/60 shadow-sm mb-4">
          <Radio className="size-9 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Device Setup</h1>
        <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[280px] mx-auto mt-2">
          Turn on your LegacyTape recorder and make sure Bluetooth is enabled on this device.
        </p>
      </div>

      <div className="flex-1 min-h-8" />

      <div className="w-full max-w-sm mx-auto space-y-3 pb-10">
        <Button className="w-full h-13 text-base rounded-xl font-semibold">Search for Device</Button>
        <Button variant="outline" className="w-full h-13 text-base rounded-xl" onClick={() => navigate("/")}>Back to Home</Button>
      </div>
    </div>
  );
};

export default DeviceSetup;
