import { KeySquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExternalProductDialogs } from "./display-provider";

export function ExternalProductPrimaryButtons() {
  const { setOpen } = useExternalProductDialogs();
  return (
    <div className="flex gap-2">
      <Button className="space-x-1" onClick={() => setOpen("add")}>
        <span>Add External Product</span> <KeySquare size={18} />
      </Button>
    </div>
  );
}
