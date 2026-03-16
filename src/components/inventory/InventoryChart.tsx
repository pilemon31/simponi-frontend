import { Overview } from "./ChartInventory";
import { RecentSales } from "./RecentInventory";

const InventoryChart = () => {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
      <div className="flex flex-col gap-6 col-span-1 lg:col-span-4 rounded-xl border bg-card py-6 text-card-foreground shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <div className="leading-none font-semibold">Hai</div>
        </div>
        <div className="px-6 ps-2">
          <Overview />
        </div>
      </div>
      <div className="flex flex-col gap-6 col-span-1 lg:col-span-3 rounded-xl border bg-card py-6 text-card-foreground shadow-sm">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6">
          <div className="leading-none font-semibold">Recent Sales</div>
          <div className="text-sm text-muted-foreground">
            You made 265 sales this month.
          </div>
        </div>
        <div className="px-6">
          <RecentSales />
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;
