// src/components/settings/connect-platform/connect-dialog.tsx

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

import type { PlatformItem, ConnectPlatformRequest } from '@/types/platform.type';
import { ConnectForm } from './connect-form';

interface ConnectDialogProps {
  open: boolean;
  platform: PlatformItem | null;
  isFirst: boolean;
  isLoading: boolean;
  storeName?: string;
  onClose: () => void;
  onSubmit: (data: ConnectPlatformRequest) => void;
}

export function ConnectDialog({
  open,
  platform,
  isFirst,
  isLoading,
  storeName,
  onClose,
  onSubmit,
}: ConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>
            Hubungkan {platform?.name}
          </DialogTitle>
          <DialogDescription>
            {isFirst
              ? 'Isi data toko dan akun marketplace kamu.'
              : `Tambahkan akun ${platform?.name} ke toko "${storeName}".`}
          </DialogDescription>
        </DialogHeader>

        {platform && (
          <ConnectForm
            platform={platform}
            isFirst={isFirst}
            isLoading={isLoading}
            storeName={storeName}
            onSubmit={onSubmit}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}