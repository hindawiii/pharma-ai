import { memo, useCallback, useState, lazy, Suspense } from "react";
import { BottomNav, TabKey } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { ScannerScreen } from "./screens/ScannerScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { AiFab } from "./AiFab";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { AuthScreen } from "./AuthScreen";
import { Loader2 } from "lucide-react";

const titles: Record<TabKey, string> = {
  home: "Pharma-i",
  scanner: "الماسح الذكي",
  nursing: "قسم التمريض",
  medication: "مكتبة الدواء",
  map: "خريطة الصيدليات",
  profile: "حسابي",
};

const MemoHome = memo(HomeScreen);
const MemoScanner = memo(ScannerScreen);
const MemoNursing = lazy(() => import("./screens/NursingScreen").then((m) => ({ default: m.NursingScreen })));
const MemoMedication = lazy(() => import("./screens/MedicationScreen").then((m) => ({ default: m.MedicationScreen })));
const MemoMap = lazy(() => import("./screens/MapScreen").then((m) => ({ default: m.MapScreen })));
const MemoRecord = lazy(() => import("./screens/RecordScreen").then((m) => ({ default: m.RecordScreen })));

const ScreenFallback = () => (
  <div className="py-16 flex items-center justify-center" role="status" aria-live="polite">
    <Loader2 className="h-6 w-6 text-primary animate-spin" />
  </div>
);

const Inner = () => {
  const { user, loading } = useAuth();
  const [active, setActive] = useState<TabKey>("home");

  const handleChange = useCallback((key: TabKey) => setActive(key), []);

  if (loading) {
    return (
      <div className="app-shell h-dvh flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const isFixedLayout = active === "scanner";

  return (
    <div className="relative app-shell h-dvh overflow-hidden bg-background shadow-elegant flex flex-col">
      <MobileTopBar title={titles[active]} />

      <main className={`flex-1 min-h-0 ${isFixedLayout ? "overflow-hidden" : "overflow-y-auto overscroll-contain"}`}>
        {active === "home" && <MemoHome onOpenScanner={() => setActive("scanner")} onOpenNursing={() => setActive("nursing")} />}
        <div className={active === "scanner" ? "h-full" : "hidden"}>
          <MemoScanner isActive={active === "scanner"} />
        </div>
        <Suspense fallback={<ScreenFallback />}>
          {active === "nursing" && <MemoNursing />}
          {active === "medication" && <MemoMedication />}
          {active === "map" && <MemoMap />}
          {active === "profile" && <MemoRecord />}
        </Suspense>
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
