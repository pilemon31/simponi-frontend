import { z } from 'zod';
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

const formSchema = z.object({
  roleName: z.string().min(1, 'First Name is required.'),
  permissions: z.any(),
});

type RolesMutateDrawerProps = {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type TaskForm = z.infer<typeof formSchema>;

export function RolesMutateDrawer({
  open,
  onOpenChange,
  currentRow,
}: RolesMutateDrawerProps) {
  const isEdit = !!currentRow;

  const form = useForm<TaskForm>({
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
    onOpenChange(false);
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
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-start'>
          <SheetTitle>{isEdit ? 'Edit' : 'Create'} Role</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Edit the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-6 overflow-y-auto px-4'
          >
            <FormField
              control={form.control}
              name='roleName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter a title' />
                  </FormControl>
                  <FormMessage />
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
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
