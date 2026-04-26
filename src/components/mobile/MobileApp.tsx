import { memo, useCallback, useState } from "react";
import { BottomNav, TabKey } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { ScannerScreen } from "./screens/ScannerScreen";
import { MapScreen } from "./screens/MapScreen";
import { RecordScreen } from "./screens/RecordScreen";
import { MedicationScreen } from "./screens/MedicationScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AiFab } from "./AiFab";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "./AuthScreen";
import { Loader2 } from "lucide-react";

const titles: Record<TabKey, string> = {
  home: "Pharma-i",
  scanner: "الماسح الذكي",
  medication: "مكتبة الدواء",
  map: "خريطة الصيدليات",
  profile: "حسابي",
};

const MemoHome = memo(HomeScreen);
const MemoScanner = memo(ScannerScreen);
const MemoMedication = memo(MedicationScreen);
const MemoMap = memo(MapScreen);
const MemoRecord = memo(RecordScreen);

const Inner = () => {
  const { user, loading } = useAuth();
  const [active, setActive] = useState<TabKey>("home");

  const handleChange = useCallback((key: TabKey) => setActive(key), []);

  if (loading) {
    return (
      <div className="mx-auto max-w-md h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const isFixedLayout = active === "scanner";

  return (
    <div className="relative mx-auto max-w-md h-dvh overflow-hidden bg-background shadow-elegant flex flex-col">
      <MobileTopBar title={titles[active]} />

      <main className={`flex-1 min-h-0 ${isFixedLayout ? "overflow-hidden" : "overflow-y-auto overscroll-contain"}`}>
        {active === "home" && <MemoHome onOpenScanner={() => setActive("scanner")} />}
        <div className={active === "scanner" ? "h-full" : "hidden"}>
          <MemoScanner isActive={active === "scanner"} />
        </div>
        {active === "medication" && <MemoMedication />}
        {active === "map" && <MemoMap />}
        {active === "profile" && <MemoRecord />}
      </main>

      <AiFab />
      <BottomNav active={active} onChange={handleChange} />
    </div>
  );
};

export const MobileApp = () => (
  <AuthProvider>
    <Inner />
  </AuthProvider>
);
