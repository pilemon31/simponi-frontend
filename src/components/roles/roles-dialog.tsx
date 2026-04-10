import { RolesMutateDrawer } from './roles-mutate-drawer';
import { RolesDeleteDialog } from './roles-delete-dialog';
import { useRoles } from './roles-provider';

export function RolesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRoles();
  return (
    <>
      <RolesMutateDrawer
        key='roles-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <RolesMutateDrawer
            key={`roles-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />

          <RolesDeleteDialog
            key={`roles-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete');
              setTimeout(() => {
                setCurrentRow(null);
              }, 500);
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  );
}
