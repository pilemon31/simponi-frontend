import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearch } from "@/context/search-provider";
import { Button } from "../ui/button";

type SearchProps = {
  className?: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
};

export function Search({
  className = "",
  placeholder = "Search",
}: SearchProps) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant="outline"
      className={cn(
        "group relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-accent sm:w-40 sm:pe-12 md:flex-none lg:w-52 xl:w-64",
        className,
      )}
      onClick={() => setOpen(true)}>
      <SearchIcon
        aria-hidden="true"
        className="absolute inset-s-1.5 top-1/2 -translate-y-1/2"
        size={16}
      />
      <span className="ms-4">{placeholder}</span>
    </Button>
  );
}
