import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Plus, Mic, RotateCcw, Lock, Sparkles, Heart, Briefcase, Baby, Mail, Pen, BookHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import SkyBackground from "@/components/SkyBackground";
import BottomTabBar from "@/components/BottomTabBar";

interface Book {
  id: string;
  title: string;
  chapters: { id: string; title: string; recorded: boolean }[];
}

const mockBooks: Book[] = [
  {
    id: "1",
    title: "My Life Story",
    chapters: [
      { id: "c1", title: "Chapter 1: Early Years", recorded: true },
      { id: "c2", title: "Chapter 2: School Days", recorded: true },
      { id: "c3", title: "Chapter 3: First Job", recorded: true },
    ],
  },
];

const RecordFlow = () => {
  const navigate = useNavigate();
  const [books] = useState<Book[]>(mockBooks);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showRerecord, setShowRerecord] = useState(false);
  const [guidedInterview, setGuidedInterview] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { id: "life", label: "Life Story", icon: BookHeart },
    { id: "childhood", label: "Childhood & Family", icon: Baby },
    { id: "love", label: "Love & Relationships", icon: Heart },
    { id: "career", label: "Career", icon: Briefcase },
    { id: "letters", label: "Letters to Family", icon: Mail },
    { id: "custom", label: "Custom", icon: Pen },
  ];

  return (
    <div className="relative flex min-h-[100dvh] flex-col safe-top safe-bottom">
      <SkyBackground />

      {/* Header */}
      <div className="pt-14 pb-4 px-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/creator-home")}
          className="flex items-center gap-1.5 text-muted-foreground active:opacity-60 transition-opacity"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Record</h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 pb-28 space-y-6">
        {/* Book Selection */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Your Books</h2>

          {books.length === 0 ? (
            <button
              onClick={() => {}}
              className="w-full p-5 rounded-2xl border border-dashed border-border bg-card/60 backdrop-blur-sm flex flex-col items-center gap-2 active:opacity-80 transition-opacity"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="size-6 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Create Your First Book</p>
              <p className="text-xs text-muted-foreground">Start recording your story</p>
            </button>
          ) : (
            <>
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => {
                    setSelectedBook(book);
                    setShowRerecord(false);
                  }}
                  className={`w-full p-4 rounded-2xl border backdrop-blur-sm text-left active:opacity-80 transition-all ${
                    selectedBook?.id === book.id
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-card/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-foreground">{book.title}</p>
                      <p className="text-[13px] text-muted-foreground">{book.chapters.length} chapters</p>
                    </div>
                    <Progress value={(book.chapters.filter(c => c.recorded).length / Math.max(book.chapters.length, 1)) * 100} className="w-16 h-1.5" />
                  </div>
                </button>
              ))}

              <button
                onClick={() => {}}
                className="w-full p-3.5 rounded-2xl border border-dashed border-border/60 bg-card/40 backdrop-blur-sm flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
              >
                <Plus className="size-4 text-primary" />
                <span className="text-sm font-medium text-primary">Create New Book</span>
              </button>
            </>
          )}
        </section>

        {/* Actions for selected book */}
        {selectedBook && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {selectedBook.title}
            </h2>

            <Button
              className="w-full h-13 text-base rounded-xl font-semibold gap-2"
              onClick={() => {}}
            >
              <Mic className="size-5" />
              Record New Chapter
            </Button>

            <Button
              variant="outline"
              className="w-full h-13 text-base rounded-xl font-semibold gap-2"
              onClick={() => setShowRerecord(!showRerecord)}
            >
              <RotateCcw className="size-4" />
              Re-record a Chapter
            </Button>

            {showRerecord && (
              <div className="space-y-2 pl-1">
                {selectedBook.chapters.map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => {}}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm text-left active:opacity-80 transition-opacity"
                  >
                    <div className={`w-2 h-2 rounded-full ${ch.recorded ? "bg-green-500" : "bg-muted-foreground/30"}`} />
                    <span className="text-sm text-foreground">{ch.title}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Guided Interview */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Guided Interview</h2>
              <p className="text-xs text-muted-foreground">Choose a topic to guide your recording</p>
            </div>
            <Switch checked={guidedInterview} onCheckedChange={setGuidedInterview} />
          </div>

          {guidedInterview && (
            <div className="grid grid-cols-2 gap-2.5">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(selectedTopic === topic.id ? null : topic.id)}
                  className={`p-3.5 rounded-2xl border backdrop-blur-sm text-left active:opacity-80 transition-all flex items-center gap-3 ${
                    selectedTopic === topic.id
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-card/80"
                  }`}
                >
                  <topic.icon className={`size-4 shrink-0 ${selectedTopic === topic.id ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[13px] font-medium ${selectedTopic === topic.id ? "text-primary" : "text-foreground"}`}>{topic.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm opacity-50 pointer-events-none flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/50 flex items-center justify-center shrink-0">
              <Sparkles className="size-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm text-foreground">AI Interviewer</p>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="size-2.5" /> Coming Soon
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">An AI guides your storytelling session</p>
            </div>
          </div>
        </section>
      </div>

      <BottomTabBar />
    </div>
  );
};

export default RecordFlow;
