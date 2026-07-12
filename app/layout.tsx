// The real root layout (html/body, providers, fonts) lives in
// `app/[locale]/layout.tsx`. next-intl's App Router setup requires this file to
// exist but only pass children through, so the locale segment owns the shell.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
