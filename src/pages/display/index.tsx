"use client";

import { Header } from "@/layouts/header";
import { useAuthStore } from "@/stores/auth-store";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { Main } from "@/layouts/main";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

import { useExternalProducts } from "@/hooks/use-external-product";
import { ExternalProductProvider } from "@/components/display/display-provider";
import { ExternalProductsTable } from "@/components/display/display-table";
// import { ExternalProductPrimaryButtons } from "@/components/display/display-primary-buttons";
import { ExternalProductDialogs } from "@/components/display/display-dialog";
import type { ExternalProductItem } from "@/types/external-product.type";

import { DollarSign, Link2, Music, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DisplayStatsCard = ({
  data,
  isLoading,
  totalCount,
}: {
  data: ExternalProductItem[];
  isLoading: boolean;
  totalCount: number;
}) => {
  const shopeeCount = data.filter((ep) =>
    ep.platform.toLowerCase().includes("shopee"),
  ).length;

  const tiktokCount = data.filter((ep) =>
    ep.platform.toLowerCase().includes("tiktok"),
  ).length;

  const avgPrice =
    data.length > 0
      ? Math.round(data.reduce((acc, ep) => acc + ep.price, 0) / data.length)
      : 0;

  const statsItems = [
    {
      label: "Total Listings",
      value: totalCount,
      icon: <Link2 className="h-4 w-4 text-muted-foreground" />,
      color: "",
    },
    {
      label: "Shopee",
      value: shopeeCount,
      icon: <ShoppingCart className="h-4 w-4 text-orange-500" />,
      color: "text-orange-500",
    },
    {
      label: "TikTok",
      value: tiktokCount,
      icon: <Music className="h-4 w-4 text-blue-500" />,
      color: "text-blue-500",
    },
    {
      label: "Avg. Price",
      value: avgPrice.toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }),
      icon: <DollarSign className="h-4 w-4 text-muted-foreground" />,
      color: "",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsItems.map((item) => (
        <Card key={item.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${item.color}`}>
              {isLoading ? (
                <span className="text-base text-muted-foreground">...</span>
              ) : (
                item.value
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const DisplayProductPage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get("search") ?? "";
  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const HandleQueryParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (!value || value === "all") {
            params.delete(key);
          } else {
            params.set(key, value);
          }
          if (key !== "page") {
            params.set("page", "1");
          }
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const HandleFilters = () => {
    setSearchInput("");
    setSearchParams(
      () => {
        const params = new URLSearchParams();
        params.set("page", "1");
        params.set("per_page", String(perPage));
        return params;
      },
      { replace: true },
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => HandleQueryParam("search", value),
      500,
    );
  };

  const handlePageChange = (newPage: number) => {
    HandleQueryParam("page", String(newPage));
  };

  const handlePerPageChange = (newLimit: number) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        params.set("per_page", String(newLimit));
        params.set("page", "1");
        return params;
      },
      { replace: true },
    );
  };

  const { data, meta, isLoading, totalCount } = useExternalProducts(
    searchInput,
    page,
    perPage,
  );

  return (
    <ExternalProductProvider>
      <ExternalProductDialogs />

      <Header>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown user={userData} />
        </div>
      </Header>

      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Display Products
            </h2>
            <p className="text-muted-foreground">
              Manage product listings across Shopee and TikTok platforms
            </p>
          </div>
          {/* <ExternalProductPrimaryButtons /> */}
        </div>

        <DisplayStatsCard
          data={data}
          isLoading={isLoading}
          totalCount={totalCount}
        />

        <ExternalProductsTable
          data={data}
          meta={meta}
          searchValue={searchInput}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSetQueryParam={HandleQueryParam}
          onClearFilters={HandleFilters}
        />
      </Main>
    </ExternalProductProvider>
  );
};

export default DisplayProductPage;
