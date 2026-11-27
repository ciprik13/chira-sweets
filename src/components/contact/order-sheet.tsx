import type { ComponentProps } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { OrderSheetClient } from "./order-sheet-client";

type Props = Omit<ComponentProps<typeof OrderSheetClient>, "dict"> & {
  dict: Pick<Dictionary, "order" | "nav">;
};

/**
 * "Comandă acum": opens every contact channel in one sheet (US-04).
 * Server wrapper: passes only the labels the sheet needs to the client, so
 * the rest of the dictionary is not serialised into every page.
 */
export function OrderSheet({ dict, ...props }: Props) {
  return (
    <OrderSheetClient
      dict={{ order: dict.order, nav: { close: dict.nav.close } }}
      {...props}
    />
  );
}
