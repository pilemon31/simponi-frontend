import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, X } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { usePlatformStatus } from '@/hooks/use-platform-status';

export function PlatformAlert() {
  const { status, isShopeeConfigured, isTikTokConfigured } =
    usePlatformStatus();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (status !== 'partial' || dismissed) return null;

  const missingPlatform = !isShopeeConfigured
    ? 'Shopee'
    : !isTikTokConfigured
      ? 'TikTok'
      : null;

  if (!missingPlatform) return null;

  return (
    <Alert className="mx-4 mt-4 border-amber-200 bg-amber-50 text-amber-800">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between gap-2">
        <span>
          {missingPlatform} belum terdaftar pada store ini. Status relasi tidak
          menjamin validitas OAuth atau kredensial.
        </span>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 border-amber-300 bg-white text-xs text-amber-700 hover:bg-amber-100"
            onClick={() => navigate('/connect')}
          >
            Kelola Platform
          </Button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="rounded p-0.5 hover:bg-amber-100"
            aria-label="Tutup"
          >
            <X className="h-3.5 w-3.5 text-amber-600" />
          </button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
