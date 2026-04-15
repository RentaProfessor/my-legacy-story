import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Mic, Newspaper, Radio } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const actions = [
    { label: "Follow a Loved One", icon: BookOpen, route: "/follow" },
    { label: "Record a Book", icon: Mic, route: "/record?type=book" },
    { label: "Record a Journal", icon: Newspaper, route: "/record?type=journal" },
    { label: "Set Up a Device", icon: Radio, route: "/device-setup" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            LegacyTape
          </h1>
          <p className="text-muted-foreground text-lg">
            Turn spoken stories into lasting legacy
          </p>
        </div>

        <div className="space-y-3">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant="outline"
              className="w-full h-14 text-base justify-start gap-4 border-border hover:bg-accent hover:border-primary/30 transition-all"
              onClick={() => navigate(action.route)}
            >
              <action.icon className="!size-5 text-primary" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
