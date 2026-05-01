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
import { useState, useEffect } from 'react';
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

type UserMutateDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow?: ProfileResponseData;
};

export function UserMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: UserMutateDrawerProps) {
  const isEdit = !!currentRow;
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const form = useForm<CreateUserRequest>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      image_url: '',
      role_id: '',
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
            }
          : {
              name: '',
              email: '',
              password: '',
              image_url: '',
              role_id: '',
            },
      );
    }
  }, [open, currentRow, isEdit, form]);

  const onSubmit = (values: CreateUserRequest) => {
    if (isEdit) {
      updateUser.mutate({ id: currentRow.id, data: values });
    } else {
      createUser.mutate(values);
    }
    onOpenChange(false);
    form.reset();
  };

  const isPending = createUser.isPending || updateUser.isPending;

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
              ? 'Edit user information.'
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
                    <Input placeholder="User name" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
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
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
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
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
