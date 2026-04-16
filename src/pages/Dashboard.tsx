import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Eye, ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import SkyBackground from "@/components/SkyBackground";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const chapters = [
  { id: 1, title: "Chapter 1: Early Years", preview: "Growing up on the farm in the summer of '52, life was simple but full of wonder…", pages: ["Growing up on the farm in the summer of '52, life was simple but full of wonder. The mornings started early with the rooster's call.", "We'd walk barefoot through the fields, the dew still cool beneath our feet. Mama would call us in for breakfast — biscuits, gravy, and stories.", "Those days shaped everything I became. The land taught patience, and the family taught love."] },
  { id: 2, title: "Chapter 2: First Love", preview: "It was a Tuesday afternoon when I first saw him at the county fair…", pages: ["It was a Tuesday afternoon when I first saw him at the county fair. He was leaning against the fence, smiling like he knew a secret.", "We danced that night under the string lights. He stepped on my toes twice, and I didn't mind one bit.", "By the end of that summer we were inseparable. The world felt bigger and smaller all at once."] },
  { id: 3, title: "Chapter 3: Building a Home", preview: "We broke ground in the spring of '71, nothing but a dream and a plot of land…", pages: ["We broke ground in the spring of '71, nothing but a dream and a plot of land. The neighbors came to help — that's how it was back then.", "Every nail, every board, we put in ourselves. The kids would play in the sawdust while we worked until sundown.", "When we finally moved in, I cried. Not because it was perfect, but because it was ours."] },
  { id: 4, title: "Chapter 4: The Family Grows", preview: "Three kids, two dogs, and a house that was never quiet…", pages: ["Three kids, two dogs, and a house that was never quiet. That was our life and I wouldn't trade a minute of it.", "Birthdays were a production. I'd bake for days — cakes, pies, cookies. The whole street would show up.", "Watching them grow was the greatest story I ever lived."] },
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const name = (location.state as any)?.name || "Marlene Chiate";
  const [bookViewOpen, setBookViewOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const progress = 65;

  const openBookView = (chapterIndex = 0) => {
    setCurrentChapter(chapterIndex);
    setCurrentPage(0);
    setBookViewOpen(true);
  };

  const totalPages = chapters[currentChapter]?.pages.length || 1;

  const goNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
    else if (currentChapter < chapters.length - 1) { setCurrentChapter((c) => c + 1); setCurrentPage(0); }
  };

  const goPrev = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1);
    else if (currentChapter > 0) { setCurrentChapter((c) => c - 1); setCurrentPage(chapters[currentChapter - 1].pages.length - 1); }
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    setTouchStart(null);
  };

  return (
    <div className="min-h-[100dvh] relative">
      <SkyBackground />

      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md px-4 pt-[env(safe-area-inset-top)] safe-top">
        <div className="flex items-center justify-between max-w-lg mx-auto py-3.5">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-muted-foreground active:opacity-60 transition-opacity p-1 -ml-1">
              <ChevronLeft className="size-6" />
            </button>
            <div className="pt-0.5">
              <h1 className="text-lg font-bold text-foreground leading-tight">{name}</h1>
              <p className="text-xs text-muted-foreground">Their story, your treasure</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-[13px] h-9 self-center" onClick={() => openBookView(0)}>
            <BookOpen className="size-3.5" />
            Book View
          </Button>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6 safe-bottom">
        <div className="p-4 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">Story Progress</span>
            <span className="font-bold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2.5 rounded-full" />
          <p className="text-xs text-muted-foreground">{chapters.length} chapters recorded</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground px-1">Chapters</h2>
          {chapters.map((ch, i) => (
            <div key={ch.id} className="border border-border/50 rounded-2xl p-4 bg-card/80 backdrop-blur-sm space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-[15px] text-foreground leading-snug">{ch.title}</h3>
                <Button variant="ghost" size="sm" className="gap-1 text-primary text-[13px] shrink-0 h-8 rounded-lg" onClick={() => openBookView(i)}>
                  <Eye className="size-3.5" /> View
                </Button>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{ch.preview}</p>
            </div>
          ))}
        </div>
      </div>

      <Dialog open={bookViewOpen} onOpenChange={setBookViewOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] h-[85dvh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className="text-base">{chapters[currentChapter]?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <p className="text-foreground leading-[1.8] text-[16px] whitespace-pre-line">
              {chapters[currentChapter]?.pages[currentPage]}
            </p>
          </div>
          <div className="border-t px-5 py-3 flex items-center justify-between bg-card shrink-0 safe-bottom">
            <Button variant="ghost" size="sm" onClick={goPrev} disabled={currentChapter === 0 && currentPage === 0} className="rounded-lg">
              <ArrowLeft className="size-4 mr-1" /> Prev
            </Button>
            <span className="text-xs text-muted-foreground font-medium">{currentPage + 1} / {totalPages}</span>
            <Button variant="ghost" size="sm" onClick={goNext} disabled={currentChapter === chapters.length - 1 && currentPage === totalPages - 1} className="rounded-lg">
              Next <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
