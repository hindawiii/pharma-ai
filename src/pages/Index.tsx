import { useState } from "react";
import { SplashScreen } from "@/components/mobile/SplashScreen";
import { MobileApp } from "@/components/mobile/MobileApp";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-primary/5 via-background to-secondary/5">
      {showSplash && <SplashScreen onDone={() => setShowSplash(false)} />}
      <MobileApp />
    </div>
  );
};

export default Index;
