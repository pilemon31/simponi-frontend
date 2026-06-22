import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Store as StoreIcon } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateStore, useUpdateStore } from '@/hooks/use-stores';
import { useUpload } from '@/hooks/use-upload';
import { resolveImageUrl } from '@/lib/media';
import {
  storeFormSchema,
  type StoreFormValues,
} from '@/schemas/store.schema';
import type { Store } from '@/types/store.type';

interface StoreFormDialogProps {
  open: boolean;
  store?: Store | null;
  canUpload: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StoreFormDialog({
  open,
  store,
  canUpload,
  onOpenChange,
}: StoreFormDialogProps) {
  const createMutation = useCreateStore();
  const updateMutation = useUpdateStore();
  const uploadMutation = useUpload();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const isEditing = Boolean(store);

  const form = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: {
      name: store?.name ?? '',
      description: store?.description ?? '',
      image_url: store?.image_url ?? '',
      is_active: store?.is_active ?? true,
    },
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    uploadMutation.isPending;
  const mutationError = createMutation.error ?? updateMutation.error;
  const watchedImageUrl = useWatch({
    control: form.control,
    name: 'image_url',
  });
  const imageUrl = resolveImageUrl(watchedImageUrl);

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      let finalImageUrl = values.image_url || '';
      if (imageFile) {
        const uploaded = await uploadMutation.uploadAsync([imageFile]);
        finalImageUrl = uploaded[0]?.image_url ?? '';
      }

      if (store) {
        await updateMutation.mutateAsync({
          storeId: store.id,
          payload: {
            name: values.name,
            description: values.description || '',
            image_url: finalImageUrl,
            is_active: values.is_active,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: values.name,
          description: values.description || undefined,
          image_url: finalImageUrl || undefined,
        });
      }

      onOpenChange(false);
    } catch {
      // Mutation and upload errors are rendered below.
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Store' : 'Tambah Store'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Perbarui informasi store. Platform dikelola secara terpisah.'
              : 'Buat store tanpa menghubungkan platform terlebih dahulu.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Nama Store</Label>
            <Input id="store-name" {...form.register('name')} />
            {form.formState.errors.name ? (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-description">Deskripsi</Label>
            <Textarea
              id="store-description"
              className="min-h-24"
              {...form.register('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store-image">Gambar Store</Label>
            {imageUrl ? (
              <div className="flex items-center gap-3 rounded-md border p-3">
                <img
                  src={imageUrl}
                  alt="Preview store"
                  className="h-14 w-14 rounded-md object-cover"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    form.setValue('image_url', '', { shouldDirty: true });
                    setImageFile(null);
                  }}
                >
                  Hapus Gambar
                </Button>
              </div>
            ) : (
              <div className="flex h-20 items-center justify-center rounded-md border border-dashed">
                <StoreIcon className="h-7 w-7 text-muted-foreground" />
              </div>
            )}
            {canUpload ? (
              <Input
                id="store-image"
                type="file"
                accept="image/jpeg,image/png"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Kamu tidak memiliki izin upload.
              </p>
            )}
            {imageFile ? (
              <p className="text-xs text-muted-foreground">
                File dipilih: {imageFile.name}
              </p>
            ) : null}
          </div>

          {isEditing ? (
            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="store-active"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                  <Label htmlFor="store-active">Store aktif</Label>
                </div>
              )}
            />
          ) : null}

          {mutationError || uploadMutation.error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {(mutationError ?? uploadMutation.error)?.message ||
                  'Gagal menyimpan store.'}
              </AlertDescription>
            </Alert>
          ) : null}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isEditing ? 'Simpan Perubahan' : 'Buat Store'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
