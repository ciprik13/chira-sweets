"use client";

import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { itemKey } from "./message";
import { dispatch, useOrderList } from "./store";

export function AddToListButton({
  category,
  slug,
  labels,
  size = "sm",
  className,
}: {
  category: string;
  slug: string;
  labels: { add: string; added: string };
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const list = useOrderList();
  const qty = list.find((i) => itemKey(i) === `${category}/${slug}`)?.qty ?? 0;

  return (
    <Button
      type="button"
      variant="outlineDark"
      size={size}
      onClick={() => dispatch({ type: "add", category, slug })}
      className={cn(
        "relative z-10",
        qty > 0 && "border-wine bg-wine/5",
        className,
      )}
    >
      {qty > 0 ? <Check aria-hidden /> : <Plus aria-hidden />}
      {qty > 0 ? `${labels.added} · ${qty}` : labels.add}
    </Button>
  );
}
