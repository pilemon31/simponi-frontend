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
import { AlertTriangle, Image as ImageIcon, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { CreateUserRequest, ProfileResponseData } from '@/types/user.type';
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/use-users';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useUsers } from './user-provider';
import { useUpload } from '@/hooks/use-upload';
import { resolveImageUrl } from '@/lib/media';

type UserMutateDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: ProfileResponseData;
};

type UserMutateFormValues = CreateUserRequest & {
  status: 'active' | 'inactive';
};

type ImagePreview = {
  url: string;
  file?: File;
};

export function UserMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: UserMutateDrawerProps) {
  const isEdit = !!currentRow;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const { uploadAsync, isPending: isUploadPending } = useUpload();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const form = useForm<UserMutateFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      image_url: '',
      role_id: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(
        isEdit
          ? {
              name: currentRow.name,
              email: currentRow.email,
              password: '',
              image_url: currentRow.image_url,
              role_id: currentRow.role.id,
              status: currentRow.status ?? 'active',
            }
          : {
              name: '',
              email: '',
              password: '',
              image_url: '',
              role_id: '',
              status: 'active',
            },
      );

      if (currentRow?.image_url) {
        setImages([{ url: resolveImageUrl(currentRow.image_url) ?? '' }]);
      } else {
        setImages([]);
      }
    }
  }, [open, currentRow, isEdit, form]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = Array.from(e.target.files || [])[0];
    if (!selectedFile) return;

    const isValidType = ['image/jpeg', 'image/png'].includes(selectedFile.type);
    const isValidSize = selectedFile.size < 100 * 1024;

    if (!isValidType) {
      form.setError('image_url', {
        type: 'manual',
        message: 'Invalid file type. Only JPEG and PNG are allowed.',
      });
      return;
    }

    if (!isValidSize) {
      form.setError('image_url', {
        type: 'manual',
        message: 'File size exceeds 100KB limit.',
      });
      return;
    }

    form.clearErrors('image_url');
    setImages((prev) => {
      prev.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
      const newPreviewUrl = URL.createObjectURL(selectedFile);
      form.setValue('image_url', newPreviewUrl, { shouldDirty: true });
      return [{ url: newPreviewUrl, file: selectedFile }];
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = () => {
    setImages((prev) => {
      prev.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
      return [];
    });
    form.setValue('image_url', '', { shouldDirty: true });
  };

  const onSubmit = async (values: UserMutateFormValues) => {
    if (isEdit) {
      updateUser.mutate(
        { id: currentRow.id, data: { status: values.status } },
        {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
          },
        },
      );
    } else {
      try {
        let imageUrl = '';
        const fileToUpload = images.find((img) => img.file)?.file;

        if (fileToUpload) {
          const uploaded = await uploadAsync([fileToUpload]);
          imageUrl = uploaded[0]?.image_url ?? '';
        } else if (values.image_url) {
          imageUrl = values.image_url;
        }

        const createPayload: CreateUserRequest = {
          name: values.name,
          email: values.email,
          password: values.password,
          image_url: imageUrl || undefined,
          role_id: values.role_id,
        };
        createUser.mutate(createPayload, {
          onSuccess: () => {
            onOpenChange(false);
            form.reset();
            handleRemoveImage();
          },
        });
      } catch (error) {
        form.setError('image_url', {
          type: 'manual',
          message:
            error instanceof Error ? error.message : 'Failed to upload image.',
        });
      }
    }
  };

  const isPending =
    createUser.isPending || updateUser.isPending || isUploadPending;

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) form.reset();
      }}
    >
      <SheetContent className="flex flex-col py-3 sm:max-w-sm">
        <SheetHeader className="text-start">
          <SheetTitle>{isEdit ? 'Edit' : 'Add'} User</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update user status only.'
              : 'Add a new user to the system.'}{' '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id="user-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 space-y-4 overflow-y-auto px-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="User name"
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="user@example.com"
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isEdit}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Image</FormLabel>
                  <Input type="hidden" {...field} />
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={img.url}
                          className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted/30"
                        >
                          <img
                            src={img.url}
                            alt={`Preview ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {!isEdit && (
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-destructive"
                            >
                              <X className="size-3" />
                            </button>
                          )}
                        </div>
                      ))}

                      {!isEdit && images.length < 1 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex h-24 w-24 flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground transition-colors hover:bg-accent"
                        >
                          <ImageIcon className="mb-1 size-6" />
                          <span className="text-[10px]">Add Image</span>
                        </button>
                      )}
                    </div>

                    {!isEdit && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isEdit}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="58001c95-eab6-4f7a-b3ce-f627499d3ebe">
                        Super Admin
                      </SelectItem>
                      <SelectItem value="791cb0fa-dc65-4510-b51d-38d52c1d73c3">
                        Client
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEdit && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: 'active' | 'inactive') =>
                        field.onChange(value)
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>
        <SheetFooter className="gap-2">
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
          <Button form="user-form" type="submit" disabled={isPending}>
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type UserDeleteDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: ProfileResponseData;
};

export function UserDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('');
  const deleteUser = useDeleteUser();

  const handleDelete = () => {
    if (value.trim() !== currentRow.name) return;
    deleteUser.mutate(currentRow.id);
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
          <AlertTriangle
            className="me-1 inline-block stroke-destructive"
            size={18}
          />
          Delete User
        </span>
      }
      desc={
        <div className="space-y-4">
          <p>
            Are you sure you want to delete{' '}
            <span className="font-bold">{currentRow.name}</span>? This action
            cannot be undone.
          </p>
          <Label className="my-2">
            User name:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter user name to confirm deletion."
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

export function UserDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers();

  return (
    <>
      <UserMutateDrawer
        key="user-add"
        open={open === 'add'}
        onOpenChange={(v) => {
          if (!v) setOpen(null);
        }}
      />
      {currentRow && (
        <>
          <UserMutateDrawer
            key={`user-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={(v) => {
              if (!v) {
                setOpen(null);
                setTimeout(() => setCurrentRow(null), 500);
              }
            }}
            currentRow={currentRow}
          />
          <UserDeleteDialog
            key={`user-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={(v) => {
              if (!v) {
                setOpen(null);
                setTimeout(() => setCurrentRow(null), 500);
              }
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
