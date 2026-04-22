import { useState } from "react";
import { Logo } from "./Logo";
import { Menu, X, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#scanner", label: "الصندوق الذكي" },
  { href: "#features", label: "المميزات" },
  { href: "#map", label: "الخريطة" },
  { href: "#pricing", label: "الباقات" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass">
      <nav className="container flex items-center justify-between h-16 md:h-20">
        <Logo size="md" />

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-foreground/80 hover:text-primary transition-smooth"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="icon" aria-label="تغيير اللغة">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="hero" size="sm">
            تحميل التطبيق
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur">
          <ul className="container py-4 space-y-3">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-sm font-semibold text-foreground/80"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Button variant="hero" size="sm" className="w-full">
                تحميل التطبيق
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
