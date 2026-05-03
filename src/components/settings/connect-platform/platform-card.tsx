// src/components/settings/connect-platform/platform-card.tsx

import { CheckCircle2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { PlatformItem } from '@/types/platform.type';

// Styling config (biar scalable)
const PLATFORM_STYLE: Record<
  string,
  { accent: string; bg: string; border: string; text: string }
> = {
  shopee: {
    accent: 'bg-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-600',
  },
  tokopedia: {
    accent: 'bg-green-500',
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
  },
};

const getStyle = (platformId: string) =>
  PLATFORM_STYLE[platformId.toLowerCase()] ?? PLATFORM_STYLE['shopee'];

interface PlatformCardProps {
  platform: PlatformItem;
  isConnected: boolean;
  connectedAs?: string;
  onClick: () => void;
}

export function PlatformCard({
  platform,
  isConnected,
  connectedAs,
  onClick,
}: PlatformCardProps) {
  const style = getStyle(platform.id);

  return (
    <Card
      className={`transition-all ${
        isConnected
          ? `${style.border} ${style.bg} cursor-default`
          : 'cursor-pointer border-border hover:border-primary hover:shadow-sm'
      }`}
      onClick={() => !isConnected && onClick()}
    >
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center justify-between">
          <div className={`h-2 w-2 rounded-full ${style.accent}`} />
          {isConnected && (
            <CheckCircle2 className={`h-4 w-4 ${style.text}`} />
          )}
        </div>
        <CardTitle className="text-base">{platform.name}</CardTitle>
      </CardHeader>

      <CardContent className="pb-4">
        {isConnected ? (
          <CardDescription className={`text-xs font-medium ${style.text}`}>
            ✓ {connectedAs ?? 'Terhubung'}
          </CardDescription>
        ) : (
          <CardDescription className="text-xs">
            Klik untuk menghubungkan
          </CardDescription>
        )}
      </CardContent>
    </Card>
  );
}