import { Settings, Bell } from "lucide-react";

interface Props {
  title: string;
}

export const MobileTopBar = ({ title }: Props) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Right (RTL first) - settings */}
        <div className="flex items-center gap-2">
          <button
            aria-label="الإعدادات"
            className="h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-base font-bold text-foreground">{title}</h1>
        </div>

        {/* Left - notifications only */}
        <div className="flex items-center gap-2">
          <button
            aria-label="التنبيهات"
            className="relative h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
    </header>
  );
};
