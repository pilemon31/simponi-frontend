import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useProductStats } from "@/hooks/use-products";

const InventoryStatsCard = () => {
  const defaultValue = {
    total_products: 0,
    total_skus: 0,
    stock_units: 0,
    low_stock: 0,
    out_of_stock: 0,
    unsynced: 0,
  };

  const { data: stats = defaultValue, isLoading } = useProductStats();

  const items = [
    { label: "Total Products", value: stats.total_products, color: "" },
    { label: "Total SKUs", value: stats.total_skus, color: "" },
    { label: "Stock Units", value: stats.stock_units, color: "" },
    { label: "Low Stock", value: stats.low_stock, color: "text-red-600" },
    {
      label: "Out of Stock",
      value: stats.out_of_stock,
      color: "text-orange-600",
    },
    { label: "Unsynced", value: stats.unsynced, color: "text-yellow-400" },
  ];

  return (
    <Tabs
      orientation="horizontal"
      defaultValue="overview"
      className="space-y-4">
      <TabsContent value="overview" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((item) => (
            <Card key={item.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">
                  {item.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${item.color}`}>
                  {isLoading ? (
                    <span className="text-muted-foreground text-base">...</span>
                  ) : (
                    item.value.toLocaleString("id-ID")
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default InventoryStatsCard;
