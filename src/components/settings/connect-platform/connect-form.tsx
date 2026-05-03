// connect-form.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Store } from 'lucide-react';

import { Button } from '@/components/ui/button';


import type { PlatformItem, ConnectPlatformRequest } from '@/types/platform.type';

// schema
const firstConnectSchema = z.object({
  store_name: z.string().min(3).max(100),
  store_description: z.string().optional(),
  external_name: z.string().min(2).max(100),
  external_shop_id: z.string().min(1),
});

const secondConnectSchema = z.object({
  external_name: z.string().min(2).max(100),
  external_shop_id: z.string().min(1),
});

type FirstConnectValues = z.infer<typeof firstConnectSchema>;
type SecondConnectValues = z.infer<typeof secondConnectSchema>;

interface ConnectFormProps {
  platform: PlatformItem;
  isFirst: boolean;
  isLoading: boolean;
  storeName?: string;
  onSubmit: (data: ConnectPlatformRequest) => void;
  onCancel: () => void;
}

export function ConnectForm({
  platform,
  isFirst,
  isLoading,
  storeName,
  onSubmit,
  onCancel,
}: ConnectFormProps) {
  const schema = isFirst ? firstConnectSchema : secondConnectSchema;

  const form = useForm<FirstConnectValues | SecondConnectValues>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = form.handleSubmit((values) => {
    if (isFirst) {
      const v = values as FirstConnectValues;
      onSubmit({
        platform_id: platform.platformDbId,
        external_name: v.external_name,
        external_shop_id: v.external_shop_id,
        store_name: v.store_name,
        store_description: v.store_description || undefined,
      });
    } else {
      const v = values as SecondConnectValues;
      onSubmit({
        platform_id: platform.platformDbId,
        external_name: v.external_name,
        external_shop_id: v.external_shop_id,
        store_name: '',
      });
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {!isFirst && storeName && (
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
          <Store className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Platform ini akan dihubungkan ke toko <strong>"{storeName}"</strong>.
          </p>
        </div>
      )}

      {/* form fields (tetap sama, tinggal copy dari file lama) */}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Hubungkan {platform.name}
        </Button>
      </div>
    </form>
  );
}