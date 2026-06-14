import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronRight, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SkyBackground from "@/components/SkyBackground";
import AppTabBar from "@/components/AppTabBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/AuthProvider";
import { getBooks, getChapters, type Book, type Chapter } from "@/lib/database";

const CreatorLibrary = () => {
  const { user } = useAuth();

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["books", user?.id],
    queryFn: () => getBooks(user!.id),
    enabled: !!user?.id,
  });

  const [expandedBookId, setExpandedBookId] = useState<string | null>(null);
  const [viewingChapter, setViewingChapter] = useState<Chapter | null>(null);

  const { data: chapters = [] } = useQuery({
    queryKey: ["chapters", expandedBookId],
    queryFn: () => getChapters(expandedBookId!),
    enabled: !!expandedBookId,
  });

  const splitIntoParagraphs = (text: string) => {
    const paragraphs = text.split(/\n\n+/).filter(Boolean);
    if (paragraphs.length <= 1) {
      const words = text.split(" ");
      const pages: string[] = [];
      for (let i = 0; i < words.length; i += 150) {
        pages.push(words.slice(i, i + 150).join(" "));
      }
      return pages.length > 0 ? pages : [text];
    }
    return paragraphs;
  };

  const [currentPage, setCurrentPage] = useState(0);
  const pages = viewingChapter ? splitIntoParagraphs(viewingChapter.transcript) : [];

  const openChapter = (ch: Chapter) => {
    setViewingChapter(ch);
    setCurrentPage(0);
  };

  return (
    <div className="min-h-[100dvh] relative flex flex-col">
      <SkyBackground />
      <header className="border-b bg-card/80 backdrop-blur-md safe-top">
        <div className="px-6 py-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
          <p className="text-sm text-muted-foreground mt-1">All your recorded books</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : books.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-16">
            <div className="text-center text-muted-foreground">
              <BookOpen className="size-12 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No books yet</p>
              <p className="text-sm mt-1">Start recording to see your books here</p>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto w-full px-5 py-5 space-y-3">
            {books.map((book: Book) => {
              const bookChapters = book.chapters ?? [];
              const isExpanded = expandedBookId === book.id;
              return (
                <div key={book.id} className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden shadow-sm">
                  <button
                    className="w-full p-4 flex items-center gap-3 text-left active:opacity-80 transition-opacity"
                    onClick={() => setExpandedBookId(isExpanded ? null : book.id)}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-foreground">{book.title}</p>
                      <p className="text-[13px] text-muted-foreground">
                        {bookChapters.length} chapter{bookChapters.length !== 1 ? "s" : ""}
                        {" · "}{book.type}
                      </p>
                    </div>
                    <ChevronRight className={`size-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                  </button>

                  {isExpanded && (
                    <div className="border-t border-border/30 px-4 pb-3">
                      {chapters.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-3 text-center">No chapters recorded yet</p>
                      ) : (
                        chapters.map((ch) => (
                          <button
                            key={ch.id}
                            className="w-full flex items-center gap-3 py-3 border-b border-border/20 last:border-0 text-left active:opacity-80 transition-opacity"
                            onClick={() => openChapter(ch)}
                          >
                            <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground">{ch.title}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {ch.transcript.slice(0, 80)}{ch.transcript.length > 80 ? "..." : ""}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {Math.floor(ch.duration_seconds / 60)}m {ch.duration_seconds % 60}s
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Chapter reader dialog */}
      <Dialog open={!!viewingChapter} onOpenChange={(open) => !open && setViewingChapter(null)}>
        <DialogContent className="max-w-[calc(100%-2rem)] h-[85dvh] flex flex-col p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="px-5 pt-5 pb-3 border-b shrink-0">
            <DialogTitle className="text-base">{viewingChapter?.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <p className="text-foreground leading-[1.8] text-[16px] whitespace-pre-line">
              {pages[currentPage]}
            </p>
          </div>
          {pages.length > 1 && (
            <div className="border-t px-5 py-3 flex items-center justify-between bg-card shrink-0 safe-bottom">
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => p - 1)} disabled={currentPage === 0} className="rounded-lg">
                <ArrowLeft className="size-4 mr-1" /> Prev
              </Button>
              <span className="text-xs text-muted-foreground font-medium">{currentPage + 1} / {pages.length}</span>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => p + 1)} disabled={currentPage === pages.length - 1} className="rounded-lg">
                Next <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AppTabBar />
    </div>
  );
};

export default CreatorLibrary;
