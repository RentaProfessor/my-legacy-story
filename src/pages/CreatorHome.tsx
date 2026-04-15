import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, BookOpen, Radio, Settings } from "lucide-react";

const CreatorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = (location.state as any)?.name || "Storyteller";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm px-4 py-4">
        <h1 className="text-xl font-bold text-foreground">Welcome, {name}</h1>
        <p className="text-sm text-muted-foreground">Your creator dashboard</p>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-4">
        {[
          { label: "Start Recording", icon: Mic, desc: "Record a new chapter for your story" },
          { label: "View Your Book", icon: BookOpen, desc: "See your story so far" },
          { label: "Set Up Device", icon: Radio, desc: "Connect your LegacyTape recorder", route: "/device-setup" },
          { label: "Settings", icon: Settings, desc: "Manage your account and family code" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => item.route && navigate(item.route)}
            className="w-full border rounded-lg p-4 bg-card flex items-center gap-4 text-left hover:border-primary/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
              <item.icon className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{item.label}</p>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreatorHome;
