import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Image as ImageIcon } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
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
  useUploadProductImage,
} from "@/hooks/use-products";

type ProductMutateDrawerProps = {
  currentRow?: ProductListItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ImagePreview = {
  id?: string;
  url: string;
  file?: File;
};

export function ProductMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: ProductMutateDrawerProps) {
  const { data: categoryData } = useProductCategories();
  const isEdit = !!currentRow;

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const uploadImages = useUploadProductImage();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const form = useForm<ProductMutateValues>({
    resolver: zodResolver(productMutateSchema),
    defaultValues: {
      name: "",
      sku: "",
      stock: 0,
      category_id: null,
      description: "",
    },
  });

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        name: currentRow.name,
        sku: currentRow.sku,
        stock: currentRow.stock,
        category_id: currentRow.category?.id ?? null,
        description: (currentRow as any).description ?? "",
      });

      if (currentRow.images && currentRow.images.length > 0) {
        const existingImages = currentRow.images.map((img) => ({
          id: img.id,
          url: resolveImageUrl(img.image_url) || "",
        }));
        setImages(existingImages);
      } else {
        setImages([]);
      }
    } else if (open) {
      form.reset({
        name: "",
        sku: "",
        stock: 0,
        category_id: null,
        description: "",
      });
      setImages([]);
    }

    return () => {
      images.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
    };
  }, [open, currentRow]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    if (images.length + selectedFiles.length > 3) {
      form.setError("root", { message: "Maksimal 3 gambar diperbolehkan" });
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      const isValidType = ["image/jpeg", "image/png"].includes(file.type);
      const isValidSize = file.size < 100 * 1024;
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      form.setError("root", {
        message:
          "Beberapa file gagal karena ukuran (>100KB) atau format tidak sesuai (hanya JPG/PNG).",
      });
    }

    const newPreviews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file,
    }));

    setImages((prev) => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prev) => {
      const toRemove = prev[indexToRemove];
      if (toRemove.file) URL.revokeObjectURL(toRemove.url);
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  const onSubmit = async (values: ProductMutateValues) => {
    try {
      let finalImageUrls: string[] = [];

      const filesToUpload = images
        .filter((img) => img.file)
        .map((img) => img.file as File);
      const existingUrls = images
        .filter((img) => !img.file)
        .map((img) => img.url);

      if (filesToUpload.length > 0) {
        const uploadRes = await uploadImages.mutateAsync(filesToUpload);
        if (uploadRes.status && uploadRes.data) {
          const newUrls = uploadRes.data.map((img) => img.image_url);
          finalImageUrls = [...existingUrls, ...newUrls];
        }
      } else {
        finalImageUrls = existingUrls;
      }

      const normalizedImages = finalImageUrls.map((url) =>
        url.replace(/\\/g, "/"),
      );
      const payload = { ...values, images: normalizedImages };

      if (isEdit) {
        updateProduct.mutate(
          { id: currentRow.id, ...payload },
          {
            onSuccess: () => onOpenChange(false),
          },
        );
      } else {
        createProduct.mutate(payload, {
          onSuccess: () => onOpenChange(false),
        });
      }
    } catch (error) {
      console.error("Gagal memproses data:", error);
    }
  };

  const isPending =
    createProduct.isPending ||
    updateProduct.isPending ||
    uploadImages.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col py-3 sm:max-w-md">
        <SheetHeader className="text-start shrink-0">
          <SheetTitle>{isEdit ? "Edit" : "Create"} Product</SheetTitle>
          <SheetDescription>
            {isEdit
              ? "Edit the product by providing necessary info."
              : "Add a new product by providing necessary info."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            id="product-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter SKU" />
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
                        value={Number.isNaN(field.value) ? "" : field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        placeholder="0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                        {categoryData?.data?.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter product details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Product Images (Max 3)</FormLabel>
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="relative w-24 h-24 rounded-md overflow-hidden border bg-muted/30">
                    <img
                      src={img.url}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-destructive transition-colors">
                      <X className="size-3" />
                    </button>
                  </div>
                ))}

                {images.length < 3 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 rounded-md border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-accent transition-colors">
                    <ImageIcon className="size-6 mb-1" />
                    <span className="text-[10px]">Add Image</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </form>
        </Form>

        <SheetFooter className="gap-2 pt-2 shrink-0">
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </SheetClose>
          <Button form="product-form" type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
