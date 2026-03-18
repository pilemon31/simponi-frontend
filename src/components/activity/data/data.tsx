import { Boxes, ShoppingCart, Plus, Eye, ArrowUp } from 'lucide-react';

export const Modules = [
  {
    label: 'Inventory',
    value: 'inventory' as const,
    icon: Boxes,
  },
  {
    label: 'Order',
    value: 'order' as const,
    icon: ShoppingCart,
  },
];

export const Actions = [
  {
    label: 'Get',
    value: 'get' as const,
    icon: Eye,
  },
  {
    label: 'Post',
    value: 'post' as const,
    icon: Plus,
  },
  {
    label: 'Update',
    value: 'update' as const,
    icon: ArrowUp,
  },
];
