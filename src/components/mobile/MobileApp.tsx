import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { BottomNav, TabKey } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";
import { ScannerScreen } from "./screens/ScannerScreen";
import { MapScreen } from "./screens/MapScreen";
import { MedicationScreen } from "./screens/MedicationScreen";
import { RecordScreen } from "./screens/RecordScreen";

// Order matches BottomNav (right→left in RTL)
const tabs: TabKey[] = ["scanner", "map", "medication", "record"];
const titles: Record<TabKey, string> = {
  scanner: "الماسح الذكي",
  map: "خريطة الصيدليات",
  medication: "جدول الأدوية",
  record: "ملفي الطبي",
};

export const MobileApp = () => {
  const [active, setActive] = useState<TabKey>("scanner");
  // Embla in RTL: direction rtl, slides flow right→left naturally
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    loop: false,
    align: "start",
    skipSnaps: false,
  });
  const programmaticScroll = useRef(false);

  // When user swipes, sync active tab
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

  // When tab clicked, scroll embla
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
        <div className="flex">
          <div className="flex-[0_0_100%] min-w-0"><ScannerScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><MapScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><MedicationScreen /></div>
          <div className="flex-[0_0_100%] min-w-0"><RecordScreen /></div>
        </div>
      </div>

      <BottomNav active={active} onChange={handleChange} />
    </div>
  );
};
