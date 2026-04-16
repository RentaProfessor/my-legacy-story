import { useNavigate } from "react-router-dom";
import { Mic, BookOpen, BookText } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import cassetteRecorder from "@/assets/cassette-recorder.png";

const Index = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Follow a Loved One", icon: "BookOpen" as const, route: "/follow", desc: "Read their story" },
    { label: "Record a Book", icon: "Mic" as const, route: "/record?type=book", desc: "Voice to keepsake" },
    { label: "Record a Journal", icon: "BookText" as const, route: "/record?type=journal", desc: "Daily reflections" },
    { label: "Set Up a Device", icon: "cassette" as const, route: "/device-setup", desc: "Connect recorder" },
  ];

  const iconMap = {
    BookOpen: <BookOpen className="size-7 text-primary" />,
    Mic: <Mic className="size-7 text-primary" />,
    BookText: <BookText className="size-7 text-primary" />,
    cassette: <img src={cassetteRecorder} alt="Cassette recorder" className="w-10 h-10 object-contain" />,
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-center px-6 safe-top safe-bottom pb-20">
      <SkyBackground />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          LegacyTape
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-[260px] mx-auto mt-2">
          Turn spoken stories into books your family will treasure forever
        </p>
      </div>

      {/* Action grid */}
      <div className="w-full max-w-sm mx-auto grid grid-cols-2 gap-3 mt-8 pb-10">
        {actions.map((action) => (
          <button
            key={action.label}
            className="aspect-square rounded-2xl bg-card/80 backdrop-blur-sm border border-border/60 flex flex-col items-center justify-center p-5 text-center active:opacity-80 transition-opacity shadow-sm"
            onClick={() => navigate(action.route)}
          >
            {iconMap[action.icon]}
            <p className="font-semibold text-[15px] text-foreground mt-3 leading-tight">{action.label}</p>
            <p className="text-[12px] text-muted-foreground leading-tight mt-1">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Index;
