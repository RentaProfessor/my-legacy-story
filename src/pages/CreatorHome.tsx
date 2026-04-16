import { useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Radio } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import BottomTabBar from "@/components/BottomTabBar";
import ModeSwitch from "@/components/ModeSwitch";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const CreatorHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = (location.state as any)?.name || "Storyteller";

  // Mock data
  const stats = { books: 2, chapters: 7 };
  const currentBook = { title: "My Life Story", chaptersDone: 3, chaptersTotal: 10 };

  return (
    <div className="min-h-[100dvh] relative flex flex-col">
      <SkyBackground />

      <header className="border-b bg-card/80 backdrop-blur-md safe-top">
        <div className="px-6 py-5 flex flex-col items-center gap-3">
          <ModeSwitch />
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Welcome, {name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Your creator dashboard</p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto w-full px-6 py-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-foreground">{stats.books}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Books</p>
            </div>
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-4 text-center shadow-sm">
              <p className="text-3xl font-bold text-foreground">{stats.chapters}</p>
              <p className="text-sm text-muted-foreground mt-0.5">Chapters</p>
            </div>
          </div>

          {/* Current Book */}
          <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <BookOpen className="size-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-[15px] text-foreground">Current Book</p>
                <p className="text-[13px] text-muted-foreground">{currentBook.title}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{currentBook.chaptersDone}/{currentBook.chaptersTotal} chapters</span>
              </div>
              <Progress value={(currentBook.chaptersDone / currentBook.chaptersTotal) * 100} className="h-2" />
            </div>
            <Button className="w-full rounded-xl" onClick={() => navigate("/record")}>
              Continue Recording
            </Button>
          </div>

          {/* Quick action */}
          <button
            onClick={() => navigate("/device-setup")}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 text-left active:opacity-80 transition-opacity shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Radio className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[15px] text-foreground">Set Up Device</p>
              <p className="text-[13px] text-muted-foreground leading-tight mt-0.5">Connect your LegacyTape recorder</p>
            </div>
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default CreatorHome;
