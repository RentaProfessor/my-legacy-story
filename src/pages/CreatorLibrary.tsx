import SkyBackground from "@/components/SkyBackground";
import BottomTabBar from "@/components/BottomTabBar";
import { BookOpen } from "lucide-react";

const CreatorLibrary = () => (
  <div className="min-h-[100dvh] relative flex flex-col">
    <SkyBackground />
    <header className="border-b bg-card/80 backdrop-blur-md safe-top">
      <div className="px-6 py-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Your Library</h1>
        <p className="text-sm text-muted-foreground mt-1">All your recorded books</p>
      </div>
    </header>
    <div className="flex-1 flex items-center justify-center pb-24">
      <div className="text-center text-muted-foreground">
        <BookOpen className="size-12 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No books yet</p>
        <p className="text-sm mt-1">Start recording to see your books here</p>
      </div>
    </div>
    <BottomTabBar />
  </div>
);

export default CreatorLibrary;
