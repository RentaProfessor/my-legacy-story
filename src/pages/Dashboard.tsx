import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Eye, ArrowLeft, ArrowRight } from "lucide-react";
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

  const progress = 65;

  const openBookView = (chapterIndex = 0) => {
    setCurrentChapter(chapterIndex);
    setCurrentPage(0);
    setBookViewOpen(true);
  };

  const totalPages = chapters[currentChapter]?.pages.length || 1;

  const goNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((p) => p + 1);
    } else if (currentChapter < chapters.length - 1) {
      setCurrentChapter((c) => c + 1);
      setCurrentPage(0);
    }
  };

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage((p) => p - 1);
    } else if (currentChapter > 0) {
      setCurrentChapter((c) => c - 1);
      setCurrentPage(chapters[currentChapter - 1].pages.length - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-xl font-bold text-foreground">{name}</h1>
        </div>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => openBookView(0)}>
          <BookOpen className="size-4" />
          Book View
        </Button>
      </header>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Story Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Chapter List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Chapters</h2>
          {chapters.map((ch, i) => (
            <div
              key={ch.id}
              className="border rounded-lg p-4 bg-card space-y-2 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-foreground">{ch.title}</h3>
                <Button variant="ghost" size="sm" className="gap-1 text-primary" onClick={() => openBookView(i)}>
                  <Eye className="size-4" /> View
                </Button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{ch.preview}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Book View Modal */}
      <Dialog open={bookViewOpen} onOpenChange={setBookViewOpen}>
        <DialogContent className="max-w-md h-[80vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2 border-b">
            <DialogTitle className="text-base">{chapters[currentChapter]?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <p className="text-foreground leading-relaxed text-base whitespace-pre-line">
              {chapters[currentChapter]?.pages[currentPage]}
            </p>
          </div>
          <div className="border-t px-6 py-3 flex items-center justify-between bg-card">
            <Button variant="ghost" size="sm" onClick={goPrev} disabled={currentChapter === 0 && currentPage === 0}>
              <ArrowLeft className="size-4 mr-1" /> Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              disabled={currentChapter === chapters.length - 1 && currentPage === totalPages - 1}
            >
              Next <ArrowRight className="size-4 ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
