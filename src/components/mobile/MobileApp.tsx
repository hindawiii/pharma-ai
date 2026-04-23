import { useEffect, useRef, useState } from "react";
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
  profile: "ملفي الطبي",
};

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

  const handleChange = (key: TabKey) => {
    setActive(key);
    if (emblaApi) {
      programmaticScroll.current = true;
      emblaApi.scrollTo(tabs.indexOf(key));
    }
  };

  return (
    <div className="relative mx-auto max-w-md min-h-dvh bg-background shadow-elegant">
      <MobileTopBar title={titles[active]} />

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex items-start">
          <div className="flex-[0_0_100%] min-w-0"><HomeScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><ScannerScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><MedicationScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><MapScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><RecordScreen /></div>
        </div>
      </div>

      <AiFab />
      <BottomNav active={active} onChange={handleChange} />
    </div>
  );
};
