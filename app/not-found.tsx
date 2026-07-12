import Link from "next/link";

/**
 * Global 404 for paths that never reach the `[locale]` segment. Because the
 * root layout is a passthrough, this page provides its own html/body shell.
 * Localized 404s are handled by `app/[locale]/not-found.tsx`.
 */
export default function GlobalNotFound() {
  return (
    <html lang="zh">
      <body
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          background: "#151515",
          color: "#fcfcfc",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600 }}>404</h1>
        <p style={{ opacity: 0.7 }}>页面不存在 · Page not found</p>
        <Link href="/" style={{ textDecoration: "underline" }}>
          返回首页 / Back home
        </Link>
      </body>
    </html>
  );
}
