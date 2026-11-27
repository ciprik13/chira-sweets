import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LocaleShell } from "@/components/layout/locale-shell";
import { localeMetadata } from "@/lib/metadata";
import "../globals.css";

export const metadata: Metadata = localeMetadata("ru");

export default function Layout({ children }: { children: ReactNode }) {
  return <LocaleShell locale="ru">{children}</LocaleShell>;
}
