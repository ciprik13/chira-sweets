import type { ReactNode } from "react";

/** Minimal root document for "/", which only forwards to the default language. */
export default function RootRedirectLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
