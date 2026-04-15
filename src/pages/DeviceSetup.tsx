import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Radio } from "lucide-react";

const DeviceSetup = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Back
        </button>

        <div className="space-y-2 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-accent flex items-center justify-center mb-4">
            <Radio className="size-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Device Setup</h1>
          <p className="text-muted-foreground">
            Turn on your LegacyTape recorder and make sure Bluetooth is enabled on this device.
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full h-12 text-base">
            Search for Device
          </Button>
          <Button variant="outline" className="w-full h-12 text-base" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeviceSetup;
