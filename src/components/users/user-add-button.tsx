import PermissionWrapper from '@/layouts/middlewares/permission-wrapper';
import { useUsers } from './user-provider';
import { Button } from '../ui/button';
import { User } from 'lucide-react';
import { USER_PERMISSIONS } from '@/constants/user-permission';

export const UserAddButton = () => {
  const { setOpen } = useUsers();
  return (
    <PermissionWrapper permissionId={USER_PERMISSIONS.CREATE}>
      <div className="flex gap-2">
        <Button className="space-x-1" onClick={() => setOpen('add')}>
          <span>Add User</span> <User size={18} />
        </Button>
      </div>
    </PermissionWrapper>
  );
};
