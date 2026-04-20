import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { type ExternalProduct } from "./data/schema";

type ProductOption = {
  id: string;
  name: string;
};

type StorePlatformOption = {
  id: string;
  label: string;
};

const formSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  storePlatformId: z.string().min(1, "Store platform is required"),
  price: z.number().min(0, "Price cannot be negative"),
});

type DisplayForm = z.infer<typeof formSchema>;

type DisplayMutateDrawerProps = {
  currentRow?: ExternalProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  productOptions?: ProductOption[];
  storePlatformOptions?: StorePlatformOption[];
  onSubmitForm?: (
    values: DisplayForm,
    currentRow?: ExternalProduct,
  ) => boolean | void | Promise<boolean | void>;
};

export function DisplayMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  isPending,
  productOptions = [],
  storePlatformOptions = [],
  onSubmitForm,
}: DisplayMutateDrawerProps) {
  const isEdit = !!currentRow;

  const form = useForm<DisplayForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          productId: currentRow.id,
          storePlatformId:
            currentRow.store_platform_name || currentRow.platform,
          price: currentRow.price,
        }
      : {
          productId: "",
          storePlatformId: "",
          price: 0,
        },
  });

  const resetDrawerState = () => {
    form.reset();
  };

  const onSubmit = async (values: DisplayForm) => {
    const shouldClose = await onSubmitForm?.(values, currentRow);

    if (shouldClose === false) {
      return;
    }

    onOpenChange(false);
    resetDrawerState();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        resetDrawerState();
      }}
    >
      <SheetContent className="flex flex-col py-3 sm:max-w-sm">
        <SheetHeader className="text-start">
          <SheetTitle>{isEdit ? "Edit" : "Create"} External Product</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update external listing information."
              : "Create a new external product listing."}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="display-product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4"
          >
            {isEdit ? (
              <>
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <FormControl>
                    <Input value={currentRow.product_name} disabled />
                  </FormControl>
                </FormItem>

                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <Input
                      value={
                        currentRow.store_platform_name ||
                        currentRow.platform.toUpperCase()
                      }
                      disabled
                    />
                  </FormControl>
                </FormItem>
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Product</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "__none"}
                          onValueChange={(value) =>
                            field.onChange(value === "__none" ? "" : value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">Select product</SelectItem>
                            {productOptions.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="storePlatformId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Platform</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "__none"}
                          onValueChange={(value) =>
                            field.onChange(value === "__none" ? "" : value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select store platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">Select platform</SelectItem>
                            {storePlatformOptions.map((platform) => (
                              <SelectItem key={platform.id} value={platform.id}>
                                {platform.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={Number.isNaN(field.value) ? 0 : field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value || 0))
                      }
                      placeholder="Enter listing price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              Close
            </Button>
          </SheetClose>
          <Button form="display-product-form" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
