import type { ReactNode } from "react";
import "./globals.css";
export const metadata = { icons: { icon: "data:," } };
export default function Layout({ children }: { children: ReactNode }) {
  return <html lang="zh"><body>{children}</body></html>;
}
