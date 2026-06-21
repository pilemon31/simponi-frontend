import { CheckCircle2, Loader2, ShieldAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlatformItem } from '@/types/platform.type';

interface PlatformCardProps {
  platform: PlatformItem;
  isConfigured: boolean;
  canConnect: boolean;
  canDisconnect: boolean;
  isBusy: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function PlatformCard({
  platform,
  isConfigured,
  canConnect,
  canDisconnect,
  isBusy,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  return (
    <Card className={isConfigured ? 'border-emerald-300 bg-emerald-50/50' : ''}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{platform.name}</CardTitle>
            <CardDescription className="mt-1">
              {isConfigured
                ? 'Platform tersedia untuk toko ini.'
                : 'Belum terdaftar pada toko ini.'}
            </CardDescription>
          </div>
          <Badge variant={isConfigured ? 'default' : 'outline'}>
            {isConfigured ? (
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
            ) : null}
            {isConfigured ? 'Terdaftar' : 'Belum terdaftar'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isConfigured ? (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              Status ini berasal dari relasi platform. Validitas OAuth dan
              kredensial tidak dapat diverifikasi dari respons backend.
            </span>
          </div>
        ) : null}

        {isConfigured ? (
          canDisconnect ? (
            <Button
              variant="destructive"
              className="w-full"
              disabled={isBusy}
              onClick={onDisconnect}
            >
              {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Hapus Relasi Platform
            </Button>
          ) : null
        ) : platform.connectSupported ? (
          canConnect ? (
            <Button className="w-full" disabled={isBusy} onClick={onConnect}>
              {isBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Mulai Konfigurasi
            </Button>
          ) : null
        ) : (
          <Button className="w-full" variant="outline" disabled>
            Belum didukung backend
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
