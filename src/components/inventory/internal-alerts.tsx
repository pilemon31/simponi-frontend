import { AlertTriangle, AlertCircle, Link2, RefreshCw } from "lucide-react";

const InventoryAlertsCard = () => {
  return (
    <div className="border rounded-lg flex flex-col gap-6 px-4 py-6">
      <h2 className="text-2xl font-bold tracking-tight">Inventory Alerts</h2>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-row items-center justify-between p-4 rounded-lg border bg-red-50 border-red-300 text-red-700">
          <div className="flex flex-row items-start gap-3">
            <AlertTriangle className="w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold text-sm">Critical Low Stock</p>
              <p className="text-sm">5 products need immediate attention</p>
            </div>
          </div>
          <button className="text-sm font-semibold hover:underline">
            View
          </button>
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-lg border bg-orange-50 border-orange-300 text-orange-700">
          <div className="flex flex-row items-start gap-3">
            <AlertCircle className="w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold text-sm">Stock Mismatch</p>
              <p className="text-sm">3 products have sync issues</p>
            </div>
          </div>
          <button className="text-sm font-semibold hover:underline">Fix</button>
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-lg border bg-yellow-50 border-yellow-300 text-yellow-700">
          <div className="flex flex-row items-start gap-3">
            <Link2 className="w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold text-sm">Unmapped SKUs</p>
              <p className="text-sm">7 SKUs need platform mapping</p>
            </div>
          </div>
          <button className="text-sm font-semibold hover:underline">Map</button>
        </div>

        <div className="flex flex-row items-center justify-between p-4 rounded-lg border bg-blue-50 border-blue-300 text-blue-700">
          <div className="flex flex-row items-start gap-3">
            <RefreshCw className="w-5 h-5 mt-1" />
            <div>
              <p className="font-semibold text-sm">Sync Pending</p>
              <p className="text-sm">Last sync 2 hours ago</p>
            </div>
          </div>
          <button className="text-sm font-semibold hover:underline">
            Sync
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlertsCard;
