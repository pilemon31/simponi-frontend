import { useEffect } from "react";
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
import {
  createExternalProductFormSchema,
  type CreateExternalProductFormValues,
} from "@/schemas/external-product.schema";
import type { ExternalProductItem } from "@/types/external-product.type";
import {
  useCreateExternalProduct,
  useUpdateExternalProduct,
} from "@/hooks/use-external-product";

type ProductOption = {
  id: string;
  name: string;
};

type PlatformOption = {
  id: string;
  label: string;
};

type ExternalProductMutateDrawerProps = {
  currentRow?: ExternalProductItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productOptions?: ProductOption[];
  platformOptions?: PlatformOption[];
};

export function ExternalProductMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  productOptions = [],
  platformOptions = [],
}: ExternalProductMutateDrawerProps) {
  const isEdit = !!currentRow;
  const createMutation = useCreateExternalProduct();
  const updateMutation = useUpdateExternalProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<CreateExternalProductFormValues>({
    resolver: zodResolver(createExternalProductFormSchema),
    defaultValues: {
      product_id: isEdit ? currentRow.id : "",
      platform_id: isEdit ? currentRow.id : "",
      price: isEdit ? currentRow.price : 0,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        product_id: isEdit ? currentRow.id : "",
        platform_id: isEdit ? currentRow.id : "",
        price: isEdit ? currentRow.price : 0,
      });
    }
  }, [open, currentRow, isEdit, form]);

  const onSubmit = (values: CreateExternalProductFormValues) => {
    if (isEdit) {
      updateMutation.mutate(
        { id: currentRow.id, payload: { price: values.price } },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
      return;
    }

    createMutation.mutate(
      {
        product_id: values.product_id,
        platform_id: values.platform_id,
        price: values.price,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      },
    );
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) form.reset();
      }}>
      <SheetContent className="flex flex-col py-3 sm:max-w-sm">
        <SheetHeader className="text-start">
          <SheetTitle>{isEdit ? "Edit" : "Create"} External Product</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Update external listing information."
              : "Create a new external product listing."}
            <br />
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="external-product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4">
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
                  name="product_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Internal Product</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "__none"}
                          onValueChange={(value) =>
                            field.onChange(value === "__none" ? "" : value)
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">
                              Select product
                            </SelectItem>
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
                  name="platform_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Platform</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value || "__none"}
                          onValueChange={(value) =>
                            field.onChange(value === "__none" ? "" : value)
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__none">
                              Select platform
                            </SelectItem>
                            {platformOptions.map((platform) => (
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
          <Button
            form="external-product-form"
            type="submit"
            disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
