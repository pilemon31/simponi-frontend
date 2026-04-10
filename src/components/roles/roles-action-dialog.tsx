'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type Role } from './data/schema';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

const formSchema = z.object({
  roleName: z.string().min(1, 'First Name is required.'),
  permissions: z.any(),
});

type UserForm = z.infer<typeof formSchema>;

type UserActionDialogProps = {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RolesActionDialog({
  currentRow,
  open,
  onOpenChange,
}: UserActionDialogProps) {
  const isEdit = !!currentRow;
  const form = useForm<UserForm>({
    resolver: zodResolver(formSchema),
    defaultValues: isEdit
      ? {
          ...currentRow,
        }
      : {
          roleName: '',
        },
  });

  const onSubmit = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset();
        onOpenChange(state);
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>{isEdit ? 'Edit Role' : 'Add New Role'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the role here. ' : 'Create new role here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='user-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='roleName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Role Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Admin'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FieldSet>
                <FieldLegend variant='label'>Vendor Module</FieldLegend>
                <FieldGroup className='gap-3'>
                  <Field orientation='horizontal'>
                    <Checkbox
                      id='finder-pref-9k2-hard-disks-ljj-checkbox'
                      name='finder-pref-9k2-hard-disks-ljj-checkbox'
                      defaultChecked
                    />
                    <FieldLabel
                      htmlFor='finder-pref-9k2-hard-disks-ljj-checkbox'
                      className='font-normal'
                    >
                      Create
                    </FieldLabel>
                  </Field>
                  <Field orientation='horizontal'>
                    <Checkbox
                      id='finder-pref-9k2-external-disks-1yg-checkbox'
                      name='finder-pref-9k2-external-disks-1yg-checkbox'
                      defaultChecked
                    />
                    <FieldLabel
                      htmlFor='finder-pref-9k2-external-disks-1yg-checkbox'
                      className='font-normal'
                    >
                      Update
                    </FieldLabel>
                  </Field>
                  <Field orientation='horizontal'>
                    <Checkbox
                      id='finder-pref-9k2-cds-dvds-fzt-checkbox'
                      name='finder-pref-9k2-cds-dvds-fzt-checkbox'
                    />
                    <FieldLabel
                      htmlFor='finder-pref-9k2-cds-dvds-fzt-checkbox'
                      className='font-normal'
                    >
                      Delete
                    </FieldLabel>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='user-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
