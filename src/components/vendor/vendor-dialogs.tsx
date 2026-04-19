import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useVendorContext } from './vendor-provider';
import type { VendorData } from './data/schema';
import { useCreateVendor, useUpdateVendor, useDeleteVendor } from '@/hooks/use-vendor';
import { useState, useEffect } from 'react';
import type { CreateVendorRequest } from '@/types/vendor.type';

// ─── Mutate Drawer (Add / Edit) ───────────────────────────────────────────────

type VendorMutateDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: VendorData;
};

export function VendorMutateDrawer({ open, onOpenChange, currentRow }: VendorMutateDrawerProps) {
  const isEdit = !!currentRow;
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();

  const form = useForm<CreateVendorRequest>({
    defaultValues: {
      name: '',
      email: '',
      phone_number: '',
      address: '',
      image_url: '',
      description: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              name: currentRow.name,
              email: currentRow.email,
              phone_number: currentRow.phone,
              address: currentRow.address,
              image_url: currentRow.image_url,
              description: currentRow.description,
            }
          : { name: '', email: '', phone_number: '', address: '', image_url: '', description: '' }
      );
    }
  }, [open, currentRow, isEdit, form]);

  const onSubmit = (values: CreateVendorRequest) => {
    if (isEdit) {
      updateVendor.mutate({ id: currentRow.id, data: values });
    } else {
      createVendor.mutate(values);
    }
    onOpenChange(false);
    form.reset();
  };

  const isPending = createVendor.isPending || updateVendor.isPending;

  return (
    <Sheet open={open} onOpenChange={(v) => { onOpenChange(v); form.reset(); }}>
      <SheetContent className="flex flex-col py-3 sm:max-w-sm">
        <SheetHeader className="text-start">
          <SheetTitle>{isEdit ? 'Edit' : 'Add'} Vendor</SheetTitle>
          <SheetDescription>
            {isEdit ? 'Edit vendor information.' : 'Add a new vendor to the system.'}
            {' '}Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id="vendor-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4"
          >
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Name *</FormLabel>
                <FormControl><Input placeholder="Vendor name" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl><Input type="email" placeholder="vendor@example.com" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="phone_number" render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl><Input placeholder="+62 812 3456 7890" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="Jl. Contoh No.1, Surabaya" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="image_url" render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL</FormLabel>
                <FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Input placeholder="Vendor description..." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </form>
        </Form>
        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button form="vendor-form" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ─── Delete Dialog ────────────────────────────────────────────────────────────

type VendorDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: VendorData;
};

export function VendorDeleteDialog({ open, onOpenChange, currentRow }: VendorDeleteDialogProps) {
  const [value, setValue] = useState('');
  const deleteVendor = useDeleteVendor();

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return;
    deleteVendor.mutate(currentRow.id);
    onOpenChange(false);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.name}
      title={
        <span className="text-destructive">
          <AlertTriangle className="me-1 inline-block stroke-destructive" size={18} />
          Delete Vendor
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow.name}</span>?
            This action cannot be undone.
          </p>
          <Label className="my-2">
            Vendor name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter vendor name to confirm deletion."
            />
          </Label>
          <Alert variant="destructive">
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation cannot be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText="Delete"
      destructive
    />
  );
}

// ─── Combined Dialogs ─────────────────────────────────────────────────────────

export function VendorDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useVendorContext();

  return (
    <>
      <VendorMutateDrawer
        key="vendor-add"
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />
      {currentRow && (
        <>
          <VendorMutateDrawer
            key={`vendor-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
          <VendorDeleteDialog
            key={`vendor-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => setCurrentRow(null), 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}