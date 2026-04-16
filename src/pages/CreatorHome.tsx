import { useLocation, useNavigate } from "react-router-dom";
import { Mic, BookOpen, Radio, Settings } from "lucide-react";

const CreatorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = (location.state as any)?.name || "Storyteller";

  const items = [
    { label: "Start Recording", icon: Mic, desc: "Record a new chapter for your story", route: undefined },
    { label: "View Your Book", icon: BookOpen, desc: "See your story so far", route: undefined },
    { label: "Set Up Device", icon: Radio, desc: "Connect your LegacyTape recorder", route: "/device-setup" },
    { label: "Settings", icon: Settings, desc: "Manage your account and family code", route: undefined },
  ];

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[hsl(210,50%,92%)] to-background">
      <header className="border-b bg-card/80 backdrop-blur-md px-5 pt-14 pb-5 safe-top">
        <h1 className="text-2xl font-bold text-foreground">Welcome, {name}</h1>
        <p className="text-sm text-muted-foreground mt-1">Your creator dashboard</p>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-3 safe-bottom">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => item.route && navigate(item.route)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/70 backdrop-blur-sm border border-border/50 text-left active:scale-[0.98] transition-all shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <item.icon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-foreground">{item.label}</p>
              <p className="text-[13px] text-muted-foreground leading-tight mt-0.5">{item.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreatorHome;
