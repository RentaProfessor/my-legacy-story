import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScanLine, Camera, CheckCircle2 } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import BottomTabBar from "@/components/BottomTabBar";

const DeviceSetup = () => {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleScan = () => {
    setScanning(true);
    // Simulate a successful scan after 3 seconds
    setTimeout(() => {
      setScanning(false);
      setConnected(true);
    }, 3000);
  };

  if (connected) {
    return (
      <div className="relative flex min-h-[100dvh] flex-col px-6 safe-top safe-bottom">
        <SkyBackground />
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
            <CheckCircle2 className="size-10 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Device Connected</h1>
          <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[260px] mx-auto mt-2">
            Your LegacyTape recorder is paired and ready to use.
          </p>
          <Button className="mt-8 h-13 px-8 text-base rounded-xl font-semibold" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
        <BottomTabBar />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[100dvh] flex-col px-6 safe-top safe-bottom">
      <SkyBackground />

      {/* Back button */}
      <div className="pt-14 pb-2">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity -ml-1">
          <ArrowLeft className="size-5" /> <span className="text-[15px]">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center pb-20">
        {!scanning ? (
          <>
            <div className="w-20 h-20 rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/60 shadow-sm mb-5">
              <ScanLine className="size-9 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Scan QR Code</h1>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[260px] mx-auto mt-2">
              Find the QR code on your LegacyTape recorder's screen and scan it to pair.
            </p>
            <div className="w-full max-w-sm mx-auto space-y-3 mt-8">
              <Button className="w-full h-13 text-base rounded-xl font-semibold gap-2" onClick={handleScan}>
                <Camera className="size-5" />
                Open Scanner
              </Button>
              <Button variant="outline" className="w-full h-13 text-base rounded-xl" onClick={() => navigate("/")}>
                Back to Home
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Scanning viewfinder */}
            <div className="relative w-64 h-64 rounded-2xl border-2 border-primary/60 bg-card/40 backdrop-blur-sm flex items-center justify-center overflow-hidden mb-6">
              {/* Animated scan line */}
              <div className="absolute inset-x-4 h-0.5 bg-primary/80 rounded-full animate-bounce" />
              {/* Corner brackets */}
              <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
              <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md" />
              <ScanLine className="size-12 text-primary/40" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">Scanning…</h2>
            <p className="text-muted-foreground text-sm mt-1">Point your camera at the QR code</p>
            <Button variant="ghost" className="mt-6 text-muted-foreground" onClick={() => setScanning(false)}>
              Cancel
            </Button>
          </>
        )}
      </div>
      <BottomTabBar />
    </div>
  );
};

export default DeviceSetup;
