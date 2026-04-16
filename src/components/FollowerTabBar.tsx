import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, User, Book } from "lucide-react";

interface FollowerTabBarProps {
  onBookView?: () => void;
}

const FollowerTabBar = ({ onBookView }: FollowerTabBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { label: "Home", icon: Home, route: "/", action: undefined },
    { label: "Library", icon: BookOpen, route: "/dashboard", action: undefined },
    { label: "Book View", icon: Book, route: null, action: onBookView },
    { label: "Profile", icon: User, route: "/follower-profile", action: undefined },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-md safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = tab.route ? location.pathname === tab.route : false;
          return (
            <button
              key={tab.label}
              onClick={() => {
                if (tab.action) tab.action();
                else if (tab.route) navigate(tab.route);
              }}
              className="flex flex-col items-center gap-1 flex-1 pt-2 pb-1"
            >
              <tab.icon
                className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FollowerTabBar;
