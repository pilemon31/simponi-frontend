import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CreateVendorRequest, VendorData } from "@/types/vendor.type";

// ─── Add / Edit Dialog ────────────────────────────────────────────────────────

type VendorFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateVendorRequest) => void;
  isLoading?: boolean;
  defaultValues?: VendorData;
  mode: "add" | "edit";
};

export function VendorFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  defaultValues,
  mode,
}: VendorFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateVendorRequest>();

  useEffect(() => {
    if (open) {
      reset(
        defaultValues
          ? {
              name: defaultValues.name,
              email: defaultValues.email,
              phone_number: defaultValues.phone, // response pakai "phone", request pakai "phone_number"
              address: defaultValues.address,
              image_url: defaultValues.image_url,
              description: defaultValues.description,
            }
          : { name: "", email: "", phone_number: "", address: "", image_url: "", description: "" }
      );
    }
  }, [open, defaultValues, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add Vendor" : "Edit Vendor"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Vendor name"
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Min 3 characters" },
                maxLength: { value: 100, message: "Max 100 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="vendor@example.com"
              {...register("email", {
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email format" },
              })}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone_number">Phone *</Label>
            <Input
              id="phone_number"
              placeholder="+62 812 3456 7890"
              {...register("phone_number", {
                required: "Phone is required",
              })}
            />
            {errors.phone_number && (
              <p className="text-xs text-destructive">{errors.phone_number.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Jl. Contoh No.1, Surabaya"
              {...register("address")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              placeholder="https://example.com/image.jpg"
              {...register("image_url")}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Vendor description..."
              rows={3}
              {...register("description")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "add"
                  ? "Add Vendor"
                  : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────

type VendorDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  vendorName?: string;
};

export function VendorDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  vendorName,
}: VendorDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{vendorName}</span>? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}