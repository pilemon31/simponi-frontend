import { useEffect, useMemo, useRef, useState } from "react";
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
  createProductSchema,
  type CreateProductFormValues,
  type Inventory,
} from "./data/schema";
import { resolveImageUrl } from "@/lib/media";

type CategoryOption = {
  id: string;
  name: string;
};

type InventoryMutateDrawerProps = {
  currentRow?: Inventory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
  categories?: CategoryOption[];
  onSubmitForm?: (
    values: CreateProductFormValues & { imageFile?: File | null },
    currentRow?: Inventory,
  ) => boolean | void | Promise<boolean | void>;
};

export function InventoryMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  isPending,
  categories = [],
  onSubmitForm,
}: InventoryMutateDrawerProps) {
  const isEdit = !!currentRow;
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const selectedImagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile],
  );

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const existingImagePreview = resolveImageUrl(currentRow?.imageUrl);
  const previewImageSrc = selectedImagePreview || existingImagePreview;

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          sku: currentRow.sku,
          stock: currentRow.stock,
          categoryId: currentRow.category?.id,
          description: currentRow.description ?? "",
        }
      : {
          name: "",
          sku: "",
          stock: 0,
          categoryId: "",
          description: "",
        },
  });

  const resetDrawerState = () => {
    form.reset();
    setImageFile(null);
  };

  const onSubmit = async (values: CreateProductFormValues) => {
    const shouldClose = await onSubmitForm?.(
      { ...values, imageFile },
      currentRow,
    );

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
      }}>
      <SheetContent className="flex flex-col py-3 sm:max-w-sm">
        <SheetHeader className="text-start">
          <SheetTitle>{isEdit ? "Edit" : "Create"} Product</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Edit the product by providing necessary info."
              : "Add a new product by providing necessary info."}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id="inventory-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter a product name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product SKU" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isEdit && (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <Input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;
                      setImageFile(selectedFile);
                      event.target.value = "";
                    }}
                  />
                </FormControl>
              </FormItem>
            )}

            {(previewImageSrc || !isEdit) && (
              <FormItem>
                <FormLabel>Image Preview</FormLabel>
                <div className="overflow-hidden rounded-md border bg-muted/30">
                  {previewImageSrc ? (
                    <img
                      src={previewImageSrc}
                      alt="Product preview"
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      No image selected
                    </div>
                  )}
                </div>
                {!isEdit && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => imageInputRef.current?.click()}>
                      Change
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setImageFile(null)}
                      disabled={!imageFile}>
                      Delete Preview
                    </Button>
                  </div>
                )}
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category (optional)</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || "__none"}
                      onValueChange={(value) =>
                        field.onChange(value === "__none" ? "" : value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={Number.isNaN(field.value) ? 0 : field.value}
                      onChange={(event) =>
                        field.onChange(Number(event.target.value || 0))
                      }
                      placeholder="Enter product stock"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter product description" />
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
          <Button form="inventory-form" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
