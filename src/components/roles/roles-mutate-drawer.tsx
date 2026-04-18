import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { type Role } from './data/schema';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { usePermissions } from '@/hooks/use-permission';
import { useCreateRole, useUpdateRole } from '@/hooks/use-roles';
import { type Permissions } from './data/schema';
import {
  type CreateRoleFormValues,
  createRoleSchema,
  type UpdateRoleFormValues,
  updateRoleSchema,
} from '@/schemas/roles.schema';

const toTitleCase = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');

const formatPermissionName = (name: string) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').trim();

const methodOrder: Record<string, number> = {
  POST: 0,
  GET: 1,
  PUT: 2,
  PATCH: 2,
  DELETE: 3,
};

const getCrudOrder = (permission: Permissions) => {
  const byMethod = methodOrder[permission.method?.toUpperCase()];
  if (byMethod !== undefined) {
    return byMethod;
  }

  const normalizedName = permission.name.toLowerCase();
  if (normalizedName.startsWith('create')) return 0;
  if (normalizedName.startsWith('get') || normalizedName.startsWith('read'))
    return 1;
  if (normalizedName.startsWith('update')) return 2;
  if (normalizedName.startsWith('delete')) return 3;

  return 99;
};

type RolesMutateDrawerProps = {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RolesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: RolesMutateDrawerProps) {
  const isEdit = !!currentRow;
  const createRole = useCreateRole();
  const updateRole = useUpdateRole();

  const form = useForm<CreateRoleFormValues | UpdateRoleFormValues>({
    resolver: zodResolver(isEdit ? updateRoleSchema : createRoleSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          id: '',
          name: '',
          permissions: [],
        },
  });

  const { data: permissionsResponse } = usePermissions();

  const allPermissions: Permissions[] =
    permissionsResponse && 'data' in permissionsResponse
      ? permissionsResponse.data.data
      : [];
  const groupedPermissions = allPermissions.reduce<
    Record<string, Permissions[]>
  >((acc, permission) => {
    const moduleName = permission.module || 'general';
    if (!acc[moduleName]) {
      acc[moduleName] = [];
    }

    acc[moduleName].push(permission);
    return acc;
  }, {});

  const onSubmit = (values: CreateRoleFormValues | UpdateRoleFormValues) => {
    onOpenChange(false);

    if (isEdit) {
      const data = values as UpdateRoleFormValues;

      const permission_ids = data.permissions.map((permission) => {
        return permission.id;
      });

      const submit = {
        id: data.id,
        name: data.name,
        permission_ids: permission_ids,
      };

      updateRole.mutate(submit);
    } else {
      const data = values as CreateRoleFormValues;

      const permission_ids = data.permissions.map((permission) => {
        return permission.id;
      });

      const submit = {
        ...data,
        permission_ids,
      };
      createRole.mutate(submit);
    }

    form.reset();
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        form.reset();
      }}
    >
      <SheetContent className='flex flex-col py-3 sm:max-w-sm'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isEdit ? 'Edit' : 'Create'} Role</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Edit the role by providing necessary info.'
              : 'Add a new role by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='roles-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FieldSet>
              <FormField
                control={form.control}
                name='permissions'
                render={({ field }) => {
                  const selectedPermissions = field.value ?? [];
                  const selectedIds = new Set(
                    selectedPermissions.map((permission) => permission.id),
                  );

                  const togglePermission = (
                    permission: Permissions,
                    checked: boolean,
                  ) => {
                    const nextPermissions = checked
                      ? [
                          ...selectedPermissions.filter(
                            (selected) => selected.id !== permission.id,
                          ),
                          permission,
                        ]
                      : selectedPermissions.filter(
                          (selected) => selected.id !== permission.id,
                        );

                    field.onChange(nextPermissions);
                  };

                  const moduleEntries: Array<[string, Permissions[]]> =
                    Object.entries(groupedPermissions).map(
                      ([moduleName, modulePermissions]) => [
                        moduleName,
                        [...modulePermissions].sort((a, b) => {
                          const orderDiff = getCrudOrder(a) - getCrudOrder(b);
                          if (orderDiff !== 0) {
                            return orderDiff;
                          }

                          return a.name.localeCompare(b.name);
                        }),
                      ],
                    );

                  return (
                    <FormItem>
                      <FieldGroup className='gap-8'>
                        {moduleEntries.map(
                          ([moduleName, modulePermissions]) => {
                            return (
                              <FieldSet key={moduleName} className='gap-0'>
                                <div className='flex items-center justify-between gap-2'>
                                  <FieldLegend variant='label'>
                                    {toTitleCase(moduleName)} Module
                                  </FieldLegend>
                                </div>
                                <FieldGroup className='gap-3'>
                                  {modulePermissions.map((permission) => (
                                    <Field
                                      orientation='horizontal'
                                      key={permission.id}
                                    >
                                      <Checkbox
                                        id={`permission-${permission.id}`}
                                        checked={selectedIds.has(permission.id)}
                                        onCheckedChange={(value) =>
                                          togglePermission(
                                            permission,
                                            Boolean(value),
                                          )
                                        }
                                      />
                                      <FieldLabel
                                        htmlFor={`permission-${permission.id}`}
                                        className='font-normal'
                                      >
                                        {formatPermissionName(permission.name)}
                                      </FieldLabel>
                                    </Field>
                                  ))}
                                </FieldGroup>
                              </FieldSet>
                            );
                          },
                        )}

                        {moduleEntries.length === 0 && (
                          <p className='text-sm text-muted-foreground'>
                            No permission data available.
                          </p>
                        )}
                      </FieldGroup>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </FieldSet>
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='roles-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
