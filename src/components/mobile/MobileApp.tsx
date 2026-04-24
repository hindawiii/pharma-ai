import { memo, useCallback, useState } from "react";
import { BottomNav, TabKey } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { ScannerScreen } from "./screens/ScannerScreen";
import { MapScreen } from "./screens/MapScreen";
import { RecordScreen } from "./screens/RecordScreen";
import { MedicationScreen } from "./screens/MedicationScreen";
import { AiFab } from "./AiFab";

const titles: Record<TabKey, string> = {
  scanner: "الماسح الذكي",
  medication: "مكتبة الدواء",
  map: "خريطة الصيدليات",
  profile: "حسابي",
};

const MemoScanner = memo(ScannerScreen);
const MemoMedication = memo(MedicationScreen);
const MemoMap = memo(MapScreen);
const MemoRecord = memo(RecordScreen);

export const MobileApp = () => {
  const [active, setActive] = useState<TabKey>("scanner");

  const handleChange = useCallback((key: TabKey) => {
    setActive(key);
  }, []);

  // Screens that manage their own internal layout (no outer scroll)
  const isFixedLayout = active === "scanner";

  return (
    <div className="relative mx-auto max-w-md h-dvh overflow-hidden bg-background shadow-elegant flex flex-col">
      <MobileTopBar title={titles[active]} />

      <main
        className={`flex-1 min-h-0 ${
          isFixedLayout ? "overflow-hidden" : "overflow-y-auto overscroll-contain"
        }`}
      >
        {/* Keep Scanner mounted to preserve camera stream; toggle visibility */}
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
