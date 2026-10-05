import { CompareTray } from "@/components/feedback/compare-tray";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { getNavData } from "@/data/navigation";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const nav = getNavData();
  return (
    <>
      <SmoothScroll />
      <AnnouncementBar />
      <Header nav={nav} />
      <MobileMenu nav={nav} />
      <main id="contenido" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <CompareTray />
      <BottomNav />
    </>
  );
}
