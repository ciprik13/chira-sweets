import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chira Sweets",
  description: "Cofetărie artizanală în Chișinău.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro">
      <body>{children}</body>
    </html>
  );
}
