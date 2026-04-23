import { useState } from "react";
import { SplashScreen } from "@/components/mobile/SplashScreen";
import { MobileApp } from "@/components/mobile/MobileApp";
import { useTheme } from "@/hooks/useTheme";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  // Initializes/persists theme from localStorage
  useTheme();

  return (
    <div className="min-h-dvh bg-background">
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <MobileApp />
    </div>
  );
};

export default Index;
