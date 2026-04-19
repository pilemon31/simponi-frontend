import { Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVendorContext } from './vendor-provider';
import PermissionWrapper from '@/layouts/middlewares/permission-wrapper';
import { VENDOR_PERMISSIONS } from '@/constants/vendor-permissions';

export function VendorPrimaryButtons() {
  const { setOpen } = useVendorContext();
  return (
    <PermissionWrapper permissionId={VENDOR_PERMISSIONS.CREATE}>
      <div className="flex gap-2">
        <Button className="space-x-1" onClick={() => setOpen('add')}>
          <span>Add Vendor</span> <Building2 size={18} />
        </Button>
      </div>
    </PermissionWrapper>
  );
}