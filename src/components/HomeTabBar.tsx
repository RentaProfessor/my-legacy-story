import { useLocation, useNavigate } from "react-router-dom";
import { Home, User, Radio, Mic, HardDrive } from "lucide-react";

const tabs: { label: string; icon: typeof Home; route: string | null; href?: string }[] = [
  { label: "Home",       icon: Home,      route: "/home" },
  { label: "Record",     icon: Mic,       route: "/record" },
  { label: "My Device",  icon: HardDrive, route: "/manage-device" },
  { label: "Buy Device", icon: Radio,     route: null, href: "https://mylegacytape.com" },
  { label: "Profile",    icon: User,      route: "/creator-profile" },
];

const HomeTabBar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/50 bg-card/80 backdrop-blur-md safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const active = tab.route ? location.pathname === tab.route : false;
          return (
            <button
              key={tab.label}
              onClick={() => {
                if (tab.href) {
                  window.open(tab.href, "_blank", "noopener,noreferrer");
                } else if (tab.route) {
                  navigate(tab.route);
                }
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

export default HomeTabBar;
