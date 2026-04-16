import { useLocation, useNavigate } from "react-router-dom";

const modes = [
  { label: "Creator", route: "/creator-home" },
  { label: "Listener", route: "/follow" },
];

const ModeSwitch = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isCreator = !location.pathname.startsWith("/follow") && !location.pathname.startsWith("/dashboard");

  return (
    <div className="inline-flex rounded-full bg-muted p-1 gap-0.5">
      {modes.map((mode) => {
        const active =
          (mode.label === "Creator" && isCreator) ||
          (mode.label === "Listener" && !isCreator);
        return (
          <button
            key={mode.label}
            onClick={() => navigate(mode.route)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};

export default ModeSwitch;
