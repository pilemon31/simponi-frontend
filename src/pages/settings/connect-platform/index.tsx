// src/pages/connect-platform/index.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Store, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Header } from '@/layouts/header';
import { Main } from '@/layouts/main';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';
import { Search } from '@/components/shared/search';
import { ThemeSwitch } from '@/components/shared/theme-switcher';
import { ConfigDrawer } from '@/components/shared/config-drawer';
import { usePlatformStatus } from '@/hooks/use-platform-status';
import { useAuthStore } from '@/stores/auth-store';
import type { PlatformItem, ConnectPlatformRequest } from '@/types/platform.type';
import shopeeLogo from '@/assets/images/platform-shopee.png';
import tokopediaLogo from '@/assets/images/platform-tokopedia.png';

// ── Validation schemas ────────────────────────────────────────────────────────

const firstConnectSchema = z.object({
  store_name: z.string().min(3, 'Minimal 3 karakter').max(100),
  store_description: z.string().optional(),
  external_name: z.string().min(2, 'Minimal 2 karakter').max(100),
  external_shop_id: z.string().min(1, 'Shop ID wajib diisi'),
});

const secondConnectSchema = z.object({
  external_name: z.string().min(2, 'Minimal 2 karakter').max(100),
  external_shop_id: z.string().min(1, 'Shop ID wajib diisi'),
});

type FirstConnectValues = z.infer<typeof firstConnectSchema>;
type SecondConnectValues = z.infer<typeof secondConnectSchema>;

// ── Platform visual config ────────────────────────────────────────────────────

const PLATFORM_STYLE: Record<string, {
  bg: string;
  border: string;
  text: string;
  dot: string;
}> = {
  shopee: {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-600 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  tokopedia: {
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
};
const PLATFORM_META: Record<string, {
  logo: string;
}> = {
  shopee: {
    logo: shopeeLogo,
  },
  tokopedia: {
    logo: tokopediaLogo,
  },
};

const getStyle = (platformId: string) =>
  PLATFORM_STYLE[platformId.toLowerCase()] ?? PLATFORM_STYLE['shopee'];

const getPlatformMeta = (platformId: string) =>
  PLATFORM_META[platformId.toLowerCase()];

// ── Connect Form ──────────────────────────────────────────────────────────────

interface ConnectFormProps {
  platform: PlatformItem;
  isFirst: boolean;
  isLoading: boolean;
  storeName?: string;
  onSubmit: (data: ConnectPlatformRequest) => void;
  onCancel: () => void;
}

function ConnectForm({
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
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Info konteks — platform kedua */}
      {!isFirst && storeName && (
        <div className='flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700 dark:border-blue-800 dark:bg-blue-950/20 dark:text-blue-400'>
          <Store className='mt-0.5 h-4 w-4 shrink-0' />
          <p>
            Platform ini akan dihubungkan ke toko{' '}
            <strong>"{storeName}"</strong>. Data toko tidak berubah.
          </p>
        </div>
      )}

      {/* Store fields — hanya platform pertama */}
      {isFirst && (
        <div className='space-y-3 rounded-lg border bg-muted/30 p-3'>
          <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
            Data Toko
          </p>
          <div className='space-y-1'>
            <Label htmlFor='store_name'>Nama Toko *</Label>
            <Input
              id='store_name'
              placeholder='contoh: Toko Serbaguna'
              {...form.register('store_name' as keyof (FirstConnectValues | SecondConnectValues))}
            />
            {(form.formState.errors as { store_name?: { message?: string } })
              .store_name && (
              <p className='text-xs text-destructive'>
                {
                  (
                    form.formState.errors as {
                      store_name?: { message?: string };
                    }
                  ).store_name?.message
                }
              </p>
            )}
          </div>
          <div className='space-y-1'>
            <Label htmlFor='store_description'>Deskripsi</Label>
            <Input
              id='store_description'
              placeholder='opsional'
              {...form.register(
                'store_description' as keyof (
                  | FirstConnectValues
                  | SecondConnectValues
                ),
              )}
            />
          </div>
        </div>
      )}

      {/* Platform fields */}
      <div className='space-y-3 rounded-lg border bg-muted/30 p-3'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          Akun {platform.name}
        </p>
        <div className='space-y-1'>
          <Label htmlFor='external_name'>Nama Toko di {platform.name} *</Label>
          <Input
            id='external_name'
            placeholder={`nama toko kamu di ${platform.name}`}
            {...form.register('external_name')}
          />
          {form.formState.errors.external_name && (
            <p className='text-xs text-destructive'>
              {form.formState.errors.external_name.message}
            </p>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='external_shop_id'>Shop ID *</Label>
          <Input
            id='external_shop_id'
            placeholder='contoh: 123456789'
            {...form.register('external_shop_id')}
          />
          {form.formState.errors.external_shop_id && (
            <p className='text-xs text-destructive'>
              {form.formState.errors.external_shop_id.message}
            </p>
          )}
          <p className='text-[11px] text-muted-foreground'>
            Dapat ditemukan di pengaturan akun {platform.name} kamu.
          </p>
        </div>
      </div>

      <div className='flex gap-2 pt-1'>
        <Button
          type='button'
          variant='outline'
          className='flex-1'
          onClick={onCancel}
          disabled={isLoading}
        >
          Batal
        </Button>
        <Button type='submit' className='flex-1' disabled={isLoading}>
          {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
          Hubungkan {platform.name}
        </Button>
      </div>
    </form>
  );
}

// ── Platform Card ─────────────────────────────────────────────────────────────

interface PlatformCardProps {
  platform: PlatformItem;
  isConnected: boolean;
  connectedAs?: string;
  onClick: () => void;
}

function PlatformCard({
  platform,
  isConnected,
  connectedAs,
  onClick,
}: PlatformCardProps) {
  const style = getStyle(platform.id);
  const meta = getPlatformMeta(platform.id);

  return (
    <Card
      className={`transition-all ${
        isConnected
          ? `${style.border} ${style.bg} cursor-default`
          : 'cursor-pointer border-border hover:border-primary hover:shadow-sm'
      }`}
      onClick={() => !isConnected && onClick()}
    >
      <CardHeader className='pb-2 pt-4'>
        <div className='flex items-center justify-between'>
          {meta?.logo ? (
            <img
              src={meta.logo}
              alt={platform.name}
              className='h-6 w-6 object-contain'
            />
          ) : (
            <div className='h-6 w-6 bg-muted rounded' />
          )}
          {isConnected && (
            <CheckCircle2 className={`h-4 w-4 ${style.text}`} />
          )}
        </div>
        <CardTitle className='text-base'>{platform.name}</CardTitle>
      </CardHeader>
      <CardContent className='pb-4'>
        {isConnected ? (
          <CardDescription className={`text-xs font-medium ${style.text}`}>
            ✓ {connectedAs ?? 'Terhubung'}
          </CardDescription>
        ) : (
          <CardDescription className='text-xs'>
            Klik untuk menghubungkan
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

interface ConnectPlatformPageProps {
  availablePlatforms: PlatformItem[];
}

export default function ConnectPlatformPage({
  availablePlatforms,
}: ConnectPlatformPageProps) {
  const navigate = useNavigate();
  const { status, store, connect, isConnecting } = usePlatformStatus();
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformItem | null>(null);

  const user = useAuthStore((state) => state.auth.user);
  const userData = {
    name: user?.name ?? '',
    email: user?.email ?? '',
    avatar: '/avatars/shadcn.jpg',
  };

  const isFirst = !store;
  const connectedCount = store?.platforms.length ?? 0;

  const handleConnect = (data: ConnectPlatformRequest) => {
    connect(data, {
      onSuccess: () => {
        setSelectedPlatform(null);
        if (status === 'partial') {
          navigate('/');
        }
      },
    });
  };

  return (
    <>
      <Header>
        <Search className='me-auto' />
        <ThemeSwitch />
        <ConfigDrawer />
        <ProfileDropdown user={userData} />
      </Header>

      <Main>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Koneksi Platform
          </h1>
          <p className='text-muted-foreground'>
            Hubungkan akun marketplace kamu untuk mulai mengelola pesanan dan
            inventaris secara terpusat.
          </p>
        </div>

        <Separator className='my-4 lg:my-6' />

        <div className='mx-auto max-w-xl space-y-6'>
          {/* Progress */}
          <div className='space-y-2'>
            <div className='flex items-center justify-between text-sm'>
              <span className='font-medium'>Platform terhubung</span>
              <span className='text-muted-foreground'>{connectedCount} / 2</span>
            </div>
            <div className='flex gap-1.5'>
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  connectedCount >= 1 ? 'bg-primary' : 'bg-muted'
                }`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  connectedCount >= 2 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              {connectedCount === 0 &&
                'Hubungkan minimal satu platform untuk mengakses dashboard.'}
              {connectedCount === 1 &&
                'Satu platform terhubung. Tambah satu lagi untuk akses omnichannel penuh.'}
              {connectedCount >= 2 && 'Semua platform terhubung. '}
            </p>
          </div>

          {/* Store info — tampil jika sudah ada store */}
          {store && (
            <div className='flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-md bg-primary/10'>
                <Store className='h-4 w-4 text-primary' />
              </div>
              <div>
                <p className='text-sm font-medium'>{store.name}</p>
                {store.description && (
                  <p className='text-xs text-muted-foreground'>
                    {store.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Platform cards */}
          <div className='grid grid-cols-2 gap-3'>
            {availablePlatforms.map((platform) => {
              const connectedPlatform = store?.platforms.find(
                (p) => p.platform_id === platform.platformDbId,
              );
              return (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  isConnected={!!connectedPlatform}
                  connectedAs={connectedPlatform?.external_name}
                  onClick={() => setSelectedPlatform(platform)}
                />
              );
            })}
          </div>

          {/* CTA */}
          {connectedCount > 0 && (
            <Button
              variant={status === 'full' ? 'default' : 'outline'}
              className='w-full'
              onClick={() => navigate('/')}
            >
              {status === 'full'
                ? 'Masuk ke Dashboard →'
                : 'Lewati untuk sekarang →'}
            </Button>
          )}
        </div>
      </Main>

      {/* Connect Dialog */}
      <Dialog
        open={!!selectedPlatform}
        onOpenChange={(open) => !open && setSelectedPlatform(null)}
      >
        <DialogContent className='max-w-sm'>
          <DialogHeader>
            <DialogTitle>Hubungkan {selectedPlatform?.name}</DialogTitle>
            <DialogDescription>
              {isFirst
                ? 'Isi data toko dan akun marketplace kamu.'
                : `Tambahkan akun ${selectedPlatform?.name} ke toko "${store?.name}".`}
            </DialogDescription>
          </DialogHeader>
          {selectedPlatform && (
            <ConnectForm
              platform={selectedPlatform}
              isFirst={isFirst}
              isLoading={isConnecting}
              storeName={store?.name}
              onSubmit={handleConnect}
              onCancel={() => setSelectedPlatform(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}