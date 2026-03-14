import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Boxes, Store } from 'lucide-react';

export type ModuleType = 'order' | 'product' | 'inventory' | 'platform';

const ModuleBadgeCard = ({ module }: { module: ModuleType }) => {
  const moduleConfig = {
    order: {
      label: 'Order',
      icon: ShoppingCart,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    product: {
      label: 'Product',
      icon: Package,
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    inventory: {
      label: 'Inventory',
      icon: Boxes,
      className: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    platform: {
      label: 'Platform',
      icon: Store,
      className: 'bg-purple-100 text-purple-700 border-purple-200',
    },
  };

  const config = moduleConfig[module];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      <Icon size={14} />
      {config.label}
    </Badge>
  );
};

export default ModuleBadgeCard;
