import FilterInventorySection from '@/components/inventory/FilterInventorySection';
import InventoryChart from '@/components/inventory/InventoryChart';
import InventoryStatsCard from '@/components/inventory/InventoryStatsCard';
import TableInventorySection from '@/components/inventory/TableInventorySection';

const InventoryPage = () => {
  return (
    <div className='space-y-8'>
      <div className='flex flex-col gap-[0.5px]'>
        <h1 className='text-2xl font-bold tracking-tight'>
          Inventory Management
        </h1>
        <p className='text-sm text-muted-foreground'>
          Monitor and manage product stock across all platforms
        </p>
      </div>

      <InventoryStatsCard />
      <InventoryChart />
      <FilterInventorySection />
      <TableInventorySection />
    </div>
  );
};

export default InventoryPage;
