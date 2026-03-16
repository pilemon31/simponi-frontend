import FilterActivitySection from '@/components/activity/FilterActivitySection';
import TableActivitySection from '@/components/activity/TableActivitySection';

const ActivityPage = () => {
  return (
    <div className="space-y-8">
      <FilterActivitySection />
      <TableActivitySection />
    </div>
  );
};

export default ActivityPage;
