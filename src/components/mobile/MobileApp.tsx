import { memo, useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BottomNav, TabKey } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { HomeScreen } from "./screens/HomeScreen";
import { ScannerScreen } from "./screens/ScannerScreen";
import { MapScreen } from "./screens/MapScreen";
import { RecordScreen } from "./screens/RecordScreen";
import { MedicationScreen } from "./screens/MedicationScreen";
import { AiFab } from "./AiFab";

const tabs: TabKey[] = ["home", "scanner", "medication", "map", "profile"];
const titles: Record<TabKey, string> = {
  home: "Pharma-i",
  scanner: "الماسح الذكي",
  medication: "مكتبة الدواء",
  map: "خريطة الصيدليات",
  profile: "حسابي",
};

// Memoize heavy screens to avoid re-renders on tab switch
const MemoHome = memo(HomeScreen);
const MemoScanner = memo(ScannerScreen);
const MemoMedication = memo(MedicationScreen);
const MemoMap = memo(MapScreen);
const MemoRecord = memo(RecordScreen);

export const MobileApp = () => {
  const [active, setActive] = useState<TabKey>("home");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    loop: false,
    align: "start",
    skipSnaps: false,
  });
  const programmaticScroll = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      if (programmaticScroll.current) {
        programmaticScroll.current = false;
        return;
      }
      const idx = emblaApi.selectedScrollSnap();
      setActive(tabs[idx]);
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const handleChange = useCallback(
    (key: TabKey) => {
      setActive(key);
      if (emblaApi) {
        programmaticScroll.current = true;
        emblaApi.scrollTo(tabs.indexOf(key));
      }
    },
    [emblaApi]
  );

  return (
    <div className="relative mx-auto max-w-md h-dvh overflow-hidden bg-background shadow-elegant flex flex-col">
      <MobileTopBar title={titles[active]} />

      <div className="flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex items-stretch h-full">
          <div className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto"><MemoHome /></div>
          <div className="flex-[0_0_100%] min-w-0 h-full"><MemoScanner /></div>
          <div className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto"><MemoMedication /></div>
          <div className="flex-[0_0_100%] min-w-0 h-full"><MemoMap /></div>
          <div className="flex-[0_0_100%] min-w-0 h-full overflow-y-auto"><MemoRecord /></div>
        </div>
      </div>

      <AiFab />
      <BottomNav active={active} onChange={handleChange} />
    </div>
  );
};
