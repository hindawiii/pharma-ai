import { RecoveryPosition } from "./RecoveryPosition";
import { CprHands } from "./CprHands";
import { Heimlich } from "./Heimlich";
import { Tourniquet } from "./Tourniquet";

// Map topic.key → illustration component
export const TOPIC_ILLUSTRATIONS: Record<string, () => JSX.Element> = {
  cpr: CprHands,
  choking: Heimlich,
  bleeding: Tourniquet,
  recovery: RecoveryPosition,
  drowning: RecoveryPosition,
  seizure: RecoveryPosition,
};

export { RecoveryPosition, CprHands, Heimlich, Tourniquet };
