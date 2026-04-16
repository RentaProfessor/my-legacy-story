import { useNavigate } from "react-router-dom";
import { Mic, Newspaper, Radio, BookOpen } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import cassetteLogo from "@/assets/cassette-logo.png";

const Index = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Follow a Loved One", icon: BookOpen, route: "/follow", desc: "Read their story as it unfolds" },
    { label: "Record a Book", icon: Mic, route: "/record?type=book", desc: "Turn your voice into a keepsake" },
    { label: "Record a Journal", icon: Newspaper, route: "/record?type=journal", desc: "Capture daily reflections" },
    { label: "Set Up a Device", icon: Radio, route: "/device-setup", desc: "Connect your LegacyTape recorder" },
  ];

  return (
    <div className="relative min-h-[100dvh] flex flex-col px-6 safe-top safe-bottom">
      <SkyBackground />

      {/* Branding */}
      <div className="pt-14 text-center">
        <img
          src={cassetteLogo}
          alt="LegacyTape"
          width={512}
          height={512}
          className="mx-auto w-36 h-36 -mb-1 object-contain"
        />
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          LegacyTape
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-[260px] mx-auto mt-2">
          Turn spoken stories into books your family will treasure forever
        </p>
      </div>

      {/* Small spacer */}
      <div className="h-8" />

      {/* Action buttons */}
      <div className="w-full max-w-sm mx-auto space-y-3 pb-8">
        {actions.map((action) => (
          <button
            key={action.label}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 text-left active:opacity-80 transition-opacity shadow-sm"
            onClick={() => navigate(action.route)}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <action.icon className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-foreground">{action.label}</p>
              <p className="text-[13px] text-muted-foreground leading-tight mt-0.5">{action.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
