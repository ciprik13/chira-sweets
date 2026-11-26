import type { Metadata } from "next";
import { HomePage } from "@/features/home/home-page";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = { alternates: pageAlternates("ro", "home") };

export default function Page() {
  return <HomePage locale="ro" />;
}
