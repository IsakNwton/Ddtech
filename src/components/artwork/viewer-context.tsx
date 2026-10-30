"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { ArtImage } from "@/lib/types";

// Se cargan solo cuando el visitante los abre: no pesan en la carga inicial
const ZoomViewer = dynamic(() => import("./zoom-viewer").then((m) => m.ZoomViewer), { ssr: false });
const ContemplateMode = dynamic(() => import("./contemplate-mode").then((m) => m.ContemplateMode), { ssr: false });

type Ctx = {
  openZoom: (index?: number) => void;
  openContemplate: () => void;
};

const ViewerContext = createContext<Ctx | null>(null);

export function useViewer() {
  const ctx = useContext(ViewerContext);
  if (!ctx) throw new Error("useViewer debe usarse dentro de <ViewerProvider>");
  return ctx;
}

export function ViewerProvider({ images, title, caption, children }: { images: ArtImage[]; title: string; caption: string; children: ReactNode }) {
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);
  const [contemplate, setContemplate] = useState(false);

  const openZoom = useCallback((index = 0) => setZoomIndex(index), []);
  const openContemplate = useCallback(() => setContemplate(true), []);
  const value = useMemo(() => ({ openZoom, openContemplate }), [openZoom, openContemplate]);

  return (
    <ViewerContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {zoomIndex !== null && <ZoomViewer key="zoom" images={images} initialIndex={zoomIndex} title={title} onClose={() => setZoomIndex(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {contemplate && <ContemplateMode key="contemplate" image={images[0]} title={title} caption={caption} onClose={() => setContemplate(false)} />}
      </AnimatePresence>
    </ViewerContext.Provider>
  );
}
