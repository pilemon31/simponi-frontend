import { KeySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductDialogs } from "./internal-provider";

export function ProductPrimaryButtons() {
  const { setOpen } = useProductDialogs();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Product</span> <KeySquare size={18} />
      </Button>
    </div>
  );
}
