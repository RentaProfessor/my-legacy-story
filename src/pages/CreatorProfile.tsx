import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { User, LogOut, Bell, Shield, HelpCircle, ChevronRight, Wrench, Copy, Check, BookOpen, FileText } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import HomeTabBar from "@/components/HomeTabBar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/lib/AuthProvider";
import { getProfile, getBooks } from "@/lib/database";

const CreatorProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [adminMode, setAdminMode] = useState(
    () => localStorage.getItem("adminMode") === "true"
  );
  const [copied, setCopied] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: !!user?.id,
  });

  const { data: books = [] } = useQuery({
    queryKey: ["books", user?.id],
    queryFn: () => getBooks(user!.id),
    enabled: !!user?.id,
  });

  const totalChapters = books.reduce(
    (sum, b) => sum + (b.chapters?.length ?? 0),
    0
  );

  const handleAdminToggle = (checked: boolean) => {
    setAdminMode(checked);
    localStorage.setItem("adminMode", String(checked));
    if (checked) {
      localStorage.removeItem("dismissedPrompts");
    }
  };

  const copyFamilyCode = async () => {
    if (!profile?.family_code) return;
    try {
      await navigator.clipboard.writeText(profile.family_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const settingsItems = [
    { icon: Bell, label: "Notifications", type: "toggle" as const, key: "notifications" },
    { icon: Shield, label: "Privacy", type: "link" as const, key: "privacy" },
    { icon: HelpCircle, label: "Help & Support", type: "link" as const, key: "help" },
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
              <p className="text-lg font-semibold text-foreground">{user?.user_metadata?.full_name || "Storyteller"}</p>
              <p className="text-sm text-muted-foreground">{user?.email || "No email"}</p>
            </div>
          </div>

          {/* Family Code */}
          {profile?.family_code && (
            <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 space-y-2">
              <p className="text-xs font-semibold text-primary uppercase tracking-wide">Your Family Code</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-mono font-bold tracking-[0.2em] text-foreground">{profile.family_code}</p>
                <Button variant="ghost" size="sm" className="rounded-lg gap-1.5" onClick={copyFamilyCode}>
                  {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share this code with family so they can follow your story</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 text-center shadow-sm">
              <BookOpen className="size-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{books.length}</p>
              <p className="text-xs text-muted-foreground">Book{books.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 text-center shadow-sm">
              <FileText className="size-5 text-primary mx-auto mb-1" />
              <p className="text-2xl font-bold text-foreground">{totalChapters}</p>
              <p className="text-xs text-muted-foreground">Chapter{totalChapters !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden shadow-sm">
            {settingsItems.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between px-5 py-4 border-b border-border/30"
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
            {/* Admin Mode */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <Wrench className="size-5 text-muted-foreground" />
                <div>
                  <span className="text-[15px] text-foreground">Admin Mode</span>
                  <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">Skip login, keep all prompts visible</p>
                </div>
              </div>
              <Switch checked={adminMode} onCheckedChange={handleAdminToggle} />
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={async () => { await signOut(); navigate("/"); }}
          >
            <LogOut className="size-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <HomeTabBar />
    </div>
  );
};

export default CreatorProfile;
