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
  productMutateSchema,
  type ProductMutateValues,
} from "@/schemas/product.schema";
import { resolveImageUrl } from "@/lib/media";
import type { ProductListItem } from "@/types/product.type";
import {
  useCreateProduct,
  useProductCategories,
  useUpdateProduct,
} from "@/hooks/use-products";

type ProductMutateDrawerProps = {
  currentRow?: ProductListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
};

export function ProductMutateDrawer({
  open,
  onOpenChange,
  currentRow,
  isPending,
}: ProductMutateDrawerProps) {
  const { data: categoryData } = useProductCategories();
  const isEdit = !!currentRow;
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

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

  const existingImagePreview = resolveImageUrl(
    currentRow?.images?.[0].image_url,
  );
  const previewImageSrc = selectedImagePreview || existingImagePreview;

  const resetImageState = () => {
    setImageFile(null);
    form.setValue("files", undefined);
    form.clearErrors("files");
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const form = useForm<ProductMutateValues>({
    resolver: zodResolver(productMutateSchema),
    defaultValues: isEdit
      ? {
          name: currentRow.name,
          sku: currentRow.sku,
          stock: currentRow.stock,
          category_id: currentRow.category?.id ?? null,
          description: (currentRow as any).description ?? "",
        }
      : {
          name: "",
          sku: "",
          stock: 0,
          category_id: null,
          description: "",
        },
  });

  const onSubmit = (values: ProductMutateValues) => {
    if (isEdit) {
      updateProduct.mutate({ id: currentRow.id, ...values });
      onOpenChange(false);
      form.reset();
      resetImageState();
      return;
    }

    if (!values.files) {
      form.setError("files", {
        message: "Product image is required",
      });
      return;
    }

    createProduct.mutate({ ...values, imageFile: values.files });
    onOpenChange(false);
    form.reset();
    resetImageState();
  };
  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
        resetImageState();
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
              <FormField
                control={form.control}
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image</FormLabel>
                    <FormControl>
                      <Input
                        ref={imageInputRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0] ?? null;

                          if (!selectedFile) {
                            resetImageState();
                            event.target.value = "";
                            return;
                          }

                          setImageFile(selectedFile);
                          field.onChange(selectedFile);
                          event.target.value = "";
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                      onClick={resetImageState}
                      disabled={!imageFile}>
                      Delete Preview
                    </Button>
                  </div>
                )}
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="category_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value ?? "__none"}
                      onValueChange={(value) =>
                        field.onChange(value === "__none" ? null : value)
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none">No Category</SelectItem>
                        {categoryData?.data?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        )) || []}
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
