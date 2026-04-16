import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";

const DeviceSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center px-6 safe-bottom">
      <SkyBackground />

      <div className="w-full max-w-sm space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors -ml-1"
        >
          <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
        </button>

        <div className="space-y-3 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 float-gentle">
            <Radio className="size-9 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Device Setup</h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed">
            Turn on your LegacyTape recorder and make sure Bluetooth is enabled on this device.
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full h-13 text-base rounded-xl font-semibold">
            Search for Device
          </Button>
          <Button variant="outline" className="w-full h-13 text-base rounded-xl" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSetup;
