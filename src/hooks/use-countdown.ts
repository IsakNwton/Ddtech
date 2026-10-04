"use client";

import { useEffect, useState } from "react";

/** Cuenta regresiva DEMOSTRATIVA hasta el próximo domingo 23:59 (hora local) */
function nextSunday(): number {
  const d = new Date();
  const day = d.getDay();
  const add = (7 - day) % 7;
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + add, 23, 59, 59);
  return end.getTime();
}

export function useCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  if (now === null) return null;
  const diff = Math.max(0, nextSunday() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}
