import { useNavigate } from "react-router-dom";
import { User, LogOut, Bell, Shield, HelpCircle, ChevronRight } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import BottomTabBar from "@/components/BottomTabBar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const CreatorProfile = () => {
  const navigate = useNavigate();

  const settingsItems = [
    { icon: Bell, label: "Notifications", type: "toggle" as const },
    { icon: Shield, label: "Privacy", type: "link" as const },
    { icon: HelpCircle, label: "Help & Support", type: "link" as const },
  ];

  return (
    <div className="min-h-[100dvh] relative flex flex-col">
      <SkyBackground />
      <header className="border-b bg-card/80 backdrop-blur-md safe-top">
        <div className="px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto w-full px-6 py-6 space-y-5">
          {/* Avatar & Name */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-full bg-primary/10 border border-border/50 flex items-center justify-center">
              <User className="size-9 text-primary" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">Storyteller</p>
              <p className="text-sm text-muted-foreground">storyteller@example.com</p>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden shadow-sm">
            {settingsItems.map((item, i) => (
              <div
                key={item.label}
                className={`flex items-center justify-between px-5 py-4 ${i < settingsItems.length - 1 ? "border-b border-border/30" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="size-5 text-muted-foreground" />
                  <span className="text-[15px] text-foreground">{item.label}</span>
                </div>
                {item.type === "toggle" ? (
                  <Switch />
                ) : (
                  <ChevronRight className="size-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Back to start */}
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => navigate("/")}
          >
            <LogOut className="size-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default CreatorProfile;
