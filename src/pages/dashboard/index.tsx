import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Clock3,
  DollarSign,
  Package,
  Package2,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  Truck,
  XCircle,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { useDashboard } from "@/hooks/use-dashboard";
import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { TopNav } from "@/layouts/top-nav";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID");

export function Dashboard() {
  const user = useAuthStore((state) => state.auth.user);
  const { data, isLoading, isError, error, refetch, isFetching } =
    useDashboard();

  const userData = {
    name: user?.name ?? "Admin",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const storeName = data?.summary.store.name || "Dashboard Toko Aktif";
  const trendData = useMemo(
    () =>
      data?.trend.series.map((item) => ({
        month: item.month,
        revenue: item.revenue,
        orders: item.orders,
      })) ?? [],
    [data],
  );

  return (
    <>
      <Header>
        <TopNav links={topNav} />
        <div className="ms-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <Main>
        {isLoading ? (
          <DashboardSkeleton />
        ) : isError ? (
          <DashboardError
            message={error?.message ?? "Gagal memuat dashboard"}
            onRetry={() => refetch()}
          />
        ) : data ? (
          <div className="space-y-5">
            <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white shadow-[0_18px_50px_rgba(15,23,42,0.25)] md:p-8">
              <div className="absolute -top-20 right-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />
              <div className="absolute -bottom-24 left-0 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/15">
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      Active store dashboard
                    </Badge>
                    <Badge className="border-emerald-400/25 bg-emerald-400/10 text-emerald-100 hover:bg-emerald-400/15">
                      {data.trend.range}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {storeName}
                    </h1>
                    <p className="max-w-xl text-sm leading-6 text-slate-200/80 sm:text-base">
                      Ringkasan operasional toko aktif dalam satu tampilan: KPI
                      utama, tren bulanan, pesanan terbaru, stok menipis, dan
                      aktivitas inventory.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-200/80">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      KPI ready
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Multi-store aware
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Operational snapshot
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                  <Button
                    variant="secondary"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="border-0 bg-white text-slate-900 hover:bg-slate-100">
                    <RefreshCcw
                      className={cn(
                        "mr-2 h-4 w-4",
                        isFetching && "animate-spin",
                      )}
                    />
                    Refresh data
                  </Button>
                  <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-100/90 backdrop-blur">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-300/70">
                      Store focus
                    </div>
                    <div className="mt-1 font-medium">
                      {data.summary.store.name}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
                <HeroStat
                  label="Revenue bulan ini"
                  value={formatCurrency(
                    data.summary.metrics.revenue_month_to_date,
                  )}
                  hint="Total revenue toko aktif"
                />
                <HeroStat
                  label="Order bulan ini"
                  value={formatNumber(
                    data.summary.metrics.orders_month_to_date,
                  )}
                  hint="Order masuk selama bulan berjalan"
                />
                <HeroStat
                  label="Produk aktif"
                  value={formatNumber(data.summary.metrics.active_products)}
                  hint="Produk siap jual di toko aktif"
                />
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Revenue bulan ini"
                value={formatCurrency(
                  data.summary.metrics.revenue_month_to_date,
                )}
                description="Total revenue untuk toko aktif"
                icon={<DollarSign className="h-4 w-4" />}
                accent="from-emerald-500/15 to-emerald-500/5"
              />
              <MetricCard
                title="Order bulan ini"
                value={formatNumber(data.summary.metrics.orders_month_to_date)}
                description="Order masuk selama bulan berjalan"
                icon={<ShoppingCart className="h-4 w-4" />}
                accent="from-sky-500/15 to-sky-500/5"
              />
              <MetricCard
                title="Produk aktif"
                value={formatNumber(data.summary.metrics.active_products)}
                description="Produk yang tersedia di toko aktif"
                icon={<Package2 className="h-4 w-4" />}
                accent="from-amber-500/15 to-amber-500/5"
              />
              <MetricCard
                title="Stok menipis"
                value={formatNumber(data.summary.metrics.low_stock_products)}
                description="Produk yang perlu segera diisi ulang"
                icon={<Package className="h-4 w-4" />}
                accent="from-rose-500/15 to-rose-500/5"
              />
            </section>

            <section>
              <Card className="border-dashed bg-muted/20 shadow-none">
                <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
                  <div>
                    <CardTitle>KPI tambahan</CardTitle>
                    <CardDescription>
                      Status operasional toko aktif.
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <BarChart3 className="h-3.5 w-3.5" />
                    Operational layer
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SmallMetricCard
                      title="Order pending"
                      value={data.summary.metrics.pending_orders}
                      icon={<Clock3 className="h-4 w-4" />}
                    />
                    <SmallMetricCard
                      title="Ready to ship"
                      value={data.summary.metrics.ready_to_ship_orders}
                      icon={<Truck className="h-4 w-4" />}
                    />
                    <SmallMetricCard
                      title="Order completed"
                      value={data.summary.metrics.completed_orders}
                      icon={<ArrowUpRight className="h-4 w-4" />}
                    />
                    <SmallMetricCard
                      title="Out of stock"
                      value={data.summary.metrics.out_of_stock_products}
                      icon={<XCircle className="h-4 w-4" />}
                    />
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 lg:grid-cols-3">
              <Card className="lg:col-span-3 overflow-hidden border-border/70 shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <CardTitle>Tren revenue dan order</CardTitle>
                      <CardDescription>
                        Tren bulanan untuk toko aktif dalam {data.trend.range}.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-primary" />{" "}
                        Revenue
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />{" "}
                        Order
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[340px] px-2 py-5 sm:px-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={trendData}
                      margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border/70"
                      />
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                        tickFormatter={(value) => numberFormatter.format(value)}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <Tooltip
                        formatter={(value, name) => {
                          const numericValue = Array.isArray(value)
                            ? Number(value[0] ?? 0)
                            : Number(value ?? 0);

                          return [
                            name === "revenue"
                              ? formatCurrency(numericValue)
                              : formatNumber(numericValue),
                            name === "revenue" ? "Revenue" : "Order",
                          ];
                        }}
                        labelFormatter={(label) => `Bulan ${label}`}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth={2.5}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="currentColor"
                        className="text-emerald-500"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>

            <section className="grid gap-4 xl:grid-cols-5">
              <Card className="xl:col-span-2 overflow-hidden border-border/70 shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle>Recent orders</CardTitle>
                  <CardDescription>
                    5 order terbaru di toko aktif.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {data.recent_orders.items.length > 0 ? (
                      data.recent_orders.items.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-xl border bg-background/80 p-4 shadow-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {order.buyer_name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.order_number}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold">
                                {formatCurrency(order.total_amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.ordered_at)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Badge
                              variant={orderStatusVariant(order.order_status)}>
                              {order.order_status.replaceAll("_", " ")}
                            </Badge>
                            <Badge
                              variant={paymentStatusVariant(
                                order.payment_status,
                              )}>
                              {order.payment_status.replaceAll("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="Belum ada order terbaru"
                        description="Data order akan muncul ketika toko aktif menerima transaksi."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4 xl:col-span-3">
                <Card className="overflow-hidden border-border/70 shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <CardTitle>Low stock products</CardTitle>
                    <CardDescription>
                      Produk dengan stok rendah atau perlu restock.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {data.low_stock.items.length > 0 ? (
                        data.low_stock.items.map((product) => (
                          <div
                            key={product.product_id}
                            className="rounded-xl border bg-background/80 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU {product.sku}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  product.stock === 0
                                    ? "destructive"
                                    : "outline"
                                }>
                                Stok {product.stock}
                              </Badge>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                              Threshold: {product.threshold}
                            </p>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          title="Tidak ada stok menipis"
                          description="Semua produk masih berada di atas threshold stok."
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-border/70 shadow-sm">
                  <CardHeader className="border-b bg-muted/20">
                    <CardTitle>Top products</CardTitle>
                    <CardDescription>
                      Produk terlaris di toko aktif.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {data.top_products.items.length > 0 ? (
                        data.top_products.items.map((product) => (
                          <div
                            key={product.product_id}
                            className="rounded-xl border bg-background/80 p-4 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium">
                                  {product.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  SKU {product.sku}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {formatNumber(product.sold_qty)} terjual
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-primary">
                              {formatCurrency(product.revenue)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <EmptyState
                          title="Belum ada top product"
                          description="Data produk terlaris akan muncul setelah ada transaksi."
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <Card className="overflow-hidden border-border/70 shadow-sm">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle>Recent inventory activity</CardTitle>
                  <CardDescription>
                    Log aktivitas stok dan perubahan operasional terbaru.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    {data.activity.items.length > 0 ? (
                      data.activity.items.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex flex-col gap-1 rounded-xl border bg-background/80 p-4 shadow-sm sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <div className="min-w-0">
                            <p className="text-sm font-medium">
                              {activity.title}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {activity.message}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <EmptyState
                        title="Belum ada aktivitas"
                        description="Aktivitas inventory terbaru akan ditampilkan di sini."
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        ) : null}
      </Main>
    </>
  );
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accent,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/70 shadow-sm",
        `bg-gradient-to-br ${accent}`,
      )}>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <div className="rounded-lg border border-border/50 bg-background/70 p-2 text-muted-foreground backdrop-blur">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function SmallMetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-1 text-xl font-semibold">{formatNumber(value)}</p>
        </div>
        <div className="rounded-xl border bg-muted/50 p-2 text-muted-foreground">
          {icon}
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white shadow-lg backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-300/70">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-[1.75rem]">
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-slate-300/75">{hint}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-dashed p-6 text-center">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="space-y-4 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-7 w-36 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-10 w-96 max-w-full" />
          <Skeleton className="h-5 w-full max-w-3xl" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="mt-2 h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[340px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gagal memuat dashboard</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onRetry}>Coba lagi</Button>
      </CardContent>
    </Card>
  );
}

function formatCurrency(value: number): string {
  return currencyFormatter.format(value ?? 0);
}

function formatNumber(value: number): string {
  return numberFormatter.format(value ?? 0);
}

function formatDate(value?: string | null): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function orderStatusVariant(status: string) {
  switch (status.toUpperCase()) {
    case "COMPLETED":
      return "default" as const;
    case "READY_TO_SHIP":
      return "secondary" as const;
    case "CANCELLED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

function paymentStatusVariant(status: string) {
  switch (status.toUpperCase()) {
    case "PAID":
      return "default" as const;
    case "REFUNDED":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

const topNav = [
  {
    title: "Overview",
    href: "dashboard/overview",
    isActive: true,
    disabled: false,
  },
  {
    title: "Customers",
    href: "dashboard/customers",
    isActive: false,
    disabled: true,
  },
  {
    title: "Products",
    href: "dashboard/products",
    isActive: false,
    disabled: true,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
    disabled: true,
  },
];
