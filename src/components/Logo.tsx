import { Pill, Sparkles } from "lucide-react";
import logo from "@/assets/pharma-i-logo.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "default" | "light";
}

export const Logo = ({ size = "md", showText = true, variant = "default" }: LogoProps) => {
  const sizes = {
    sm: { img: "h-8 w-8", text: "text-lg" },
    md: { img: "h-10 w-10", text: "text-2xl" },
    lg: { img: "h-14 w-14", text: "text-3xl" },
  };

  return (
    <div className="flex items-center gap-3">
      <img
        src={logo}
        alt="Pharma-i Logo"
        className={`${sizes[size].img} object-contain drop-shadow-md`}
        width={56}
        height={56}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-display font-bold ${sizes[size].text} ${variant === "light" ? "text-white" : "text-gradient"}`}>
            Pharma-i
          </span>
          <span className={`text-[10px] font-medium tracking-widest mt-0.5 ${variant === "light" ? "text-white/70" : "text-muted-foreground"}`}>
            MEDICAL · AI
          </span>
        </div>
      )}
    </div>
  );
};
