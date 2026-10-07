import { Marquee } from "@/components/motion/marquee";

const highlights = ["中文内容", "键盘操作", "响应式布局", "减少动效", "独立安装"];

// The install graph ships the component without the site's animation utilities.
const animationStyles = `
  @keyframes usage-marquee-scroll {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-100% - var(--gap, 1rem))); }
  }
  .usage-marquee .animate-marquee { animation: usage-marquee-scroll 30s linear infinite; }
  .usage-marquee:hover .animate-marquee { animation-play-state: paused; }
  @media (prefers-reduced-motion: reduce) {
    .usage-marquee .animate-marquee { animation: none; }
  }
`;

export function MarqueeExample() {
  return (
    <section className="usage-marquee w-full max-w-xl space-y-3">
      <style>{animationStyles}</style>
      <h2 className="font-medium">界面设计要点</h2>
      <Marquee speed={24} pauseOnHover gap="1rem">
        {highlights.map((text) => <span key={text} className="inline-flex rounded-xl border border-border bg-card px-5 py-3 text-sm">{text}</span>)}
      </Marquee>
      <p className="text-sm text-muted-foreground">悬停可暂停滚动；减少动态偏好下保持静止。</p>
    </section>
  );
}
