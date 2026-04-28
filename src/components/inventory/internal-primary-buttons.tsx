import { ShoppingBasketIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventoryDialogs } from "./internal-provider";

export function InternalPrimaryButtons() {
  const { setOpen } = useInventoryDialogs();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Product</span> <ShoppingBasketIcon size={18} />
      </Button>
    </div>
  );
}
