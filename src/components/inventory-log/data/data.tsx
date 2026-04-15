import { ShoppingBag, Music2, Store } from 'lucide-react';

export const Sources = [
  {
    label: 'Shopee',
    value: 'shopee' as const,
    icon: ShoppingBag,
  },
  {
    label: 'TikTok Shop',
    value: 'tiktok' as const,
    icon: Music2,
  },
  {
    label: 'Manual',
    value: 'manual' as const,
    icon: Store,
  },
];
