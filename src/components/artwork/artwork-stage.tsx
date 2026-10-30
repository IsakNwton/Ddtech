"use client";

import { Eye, Maximize2, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ArtworkImage, artTransitionName } from "@/components/art/artwork-image";
import { DemoBadge } from "@/components/ui/badges";
import { EASE_GALLERY } from "@/lib/motion";
import type { ArtImage } from "@/lib/types";
import { useViewer } from "./viewer-context";

/** La pintura, enorme y completa, sobre la «pared» de la sala */
export function ArtworkStage({ slug, image, title, isDemo }: { slug: string; image: ArtImage; title: string; isDemo: boolean }) {
  const { openZoom, openContemplate } = useViewer();
  const ratio = image.width / image.height;

  return (
    <div className="relative">
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => openZoom(0)}
          className="group relative block cursor-zoom-in rounded-[2px] focus-visible:outline-offset-8"
          style={{ width: `min(100%, calc(74svh * ${ratio}))` }}
          aria-label={`Ampliar «${title}» en alta resolución`}
        >
          <div className="painting-shadow rounded-[2px]">
            <ArtworkImage
              image={image}
              priority
              quality={90}
              sizes="(min-width: 1600px) 1400px, 92vw"
              transitionName={artTransitionName(slug)}
            />
          </div>
          {isDemo && <DemoBadge className="absolute left-3 top-3" label="Imagen de demostración" />}
        </button>
      </div>

      <motion.div
        className="mt-7 flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_GALLERY, delay: 0.45 }}
      >
        <div className="glass flex items-center gap-1 rounded-full p-1">
          <StageButton onClick={() => openZoom(0)} icon={<Maximize2 className="size-4" strokeWidth={1.5} />}>
            Ampliar
          </StageButton>
          <StageButton onClick={openContemplate} icon={<Eye className="size-4" strokeWidth={1.5} />}>
            Contemplar obra
          </StageButton>
          <ShareButton title={title} />
        </div>
      </motion.div>
    </div>
  );
}

function StageButton({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="press flex h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] text-ink-soft hover:bg-ink/[0.06] hover:text-ink sm:px-5">
      {icon}
      <span>{children}</span>
    </button>
  );
}

function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // cancelado por el usuario
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {}
  };
  return (
    <button
      type="button"
      onClick={share}
      className="press flex h-11 items-center gap-2 rounded-full px-4 text-[0.8125rem] text-ink-soft hover:bg-ink/[0.06] hover:text-ink"
      aria-label="Compartir esta obra"
    >
      <Share2 className="size-4" strokeWidth={1.5} />
      <span className="hidden sm:inline" aria-live="polite">
        {copied ? "Enlace copiado" : "Compartir"}
      </span>
    </button>
  );
}
