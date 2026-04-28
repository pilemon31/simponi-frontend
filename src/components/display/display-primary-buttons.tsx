import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDisplayDialogs } from "./display-provider";

export function DisplayPrimaryButtons() {
  const { setOpen } = useDisplayDialogs();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add Display Product</span> <ShoppingCart size={18} />
      </Button>
    </div>
  );
}
