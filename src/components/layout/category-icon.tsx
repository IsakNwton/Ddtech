import {
  CircuitBoard,
  Cpu,
  Fan,
  Gpu,
  HardDrive,
  Headphones,
  Keyboard,
  MemoryStick,
  Monitor,
  Mouse,
  PcCase,
  PlugZap,
  Snowflake,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

export const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  cpu: Cpu,
  gpu: Gpu,
  motherboard: CircuitBoard,
  ram: MemoryStick,
  storage: HardDrive,
  psu: PlugZap,
  case: PcCase,
  cooling: Snowflake,
  fans: Fan,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headset: Headphones,
  pc: PcCase,
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const Icon = CATEGORY_ICONS[id];
  return <Icon className={className} aria-hidden />;
}
