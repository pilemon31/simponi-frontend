import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ModuleBadgeCard, { type ModuleType } from './ModuleBadgeCard';
import ActionBadge, { type ActionType } from './ActionBadgeCard';

const ListTable = [
  {
    module: 'Inventory',
    action: 'POST',
    activity: 'Create',
    description: 'Created a new activity',
    date: '2023-10-01 10:00:00',
  },
  {
    module: 'Order',
    action: 'GET',
    activity: 'Get All Activity',
    description: 'Retrieved all activities',
    date: '2023-10-01 12:00:00',
  },
];

const TableActivitySection = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Module</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Activity</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Date & Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ListTable.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <ModuleBadgeCard
                module={item.module.toLowerCase() as ModuleType}
              />
            </TableCell>
            <TableCell>
              <ActionBadge action={item.action as ActionType} />
            </TableCell>
            <TableCell>{item.activity}</TableCell>
            <TableCell className="max-w-32 truncate">
              {item.description}
            </TableCell>
            <TableCell className="text-right">{item.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableActivitySection;
