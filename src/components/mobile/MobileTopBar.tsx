import { Settings, User, Bell } from "lucide-react";
import logo from "@/assets/pharma-i-logo.png";

interface Props {
  title: string;
}

export const MobileTopBar = ({ title }: Props) => {
  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Right side (RTL = first in DOM) - settings & profile */}
        <div className="flex items-center gap-2">
          <button
            aria-label="الإعدادات"
            className="h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            aria-label="الملف الشخصي"
            className="h-10 w-10 rounded-full gradient-primary flex items-center justify-center text-white shadow-card"
          >
            <User className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-base font-bold text-foreground">{title}</h1>
        </div>

        {/* Left side - logo & notifications */}
        <div className="flex items-center gap-2">
          <button
            aria-label="التنبيهات"
            className="relative h-10 w-10 rounded-full bg-white/70 flex items-center justify-center text-foreground/80 hover:bg-white shadow-soft transition-smooth"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-destructive" />
          </button>
          <img src={logo} alt="Pharma-i" className="h-9 w-9 object-contain" />
        </div>
      </div>
    </header>
  );
};
