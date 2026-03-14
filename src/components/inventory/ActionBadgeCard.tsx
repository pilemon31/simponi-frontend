import { Badge } from '@/components/ui/badge';
import { Plus, Eye, RefreshCw, FileText } from 'lucide-react';

export type ActionType = 'POST' | 'GET' | 'DETAIL' | 'UPDATE';

const ActionBadge = ({ action }: { action: ActionType }) => {
  const actionConfig = {
    POST: {
      icon: Plus,
      className: 'bg-green-100 text-green-700 border-green-200',
    },
    GET: {
      icon: Eye,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    DETAIL: {
      icon: FileText,
      className: 'bg-gray-100 text-gray-700 border-gray-200',
    },
    UPDATE: {
      icon: RefreshCw,
      className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
  };

  const config = actionConfig[action];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1 ${config.className}`}>
      <Icon size={14} />
      {action}
    </Badge>
  );
};

export default ActionBadge;
