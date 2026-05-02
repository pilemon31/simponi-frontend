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
import type { ErrorResponse } from "@/types/response.type";
import type { GetAllProductResponse } from "@/types/product.type";
import { useProducts } from "@/hooks/use-products";
import { ProductProvider } from "@/components/inventory/internal-provider";
import { ProductsTable } from "@/components/inventory/internal-table";
import { ProductPrimaryButtons } from "@/components/inventory/internal-primary-buttons";
import { ProductDialogs } from "@/components/inventory/internal-dialog";

const isGetAllProductSuccess = (
  response: GetAllProductResponse | ErrorResponse | undefined,
): response is GetAllProductResponse => response?.status === true;

const ProductsPage = () => {
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

  const { data: productData } = useProducts(searchInput, page, perPage);
  const data = isGetAllProductSuccess(productData)
    ? Array.isArray(productData.data)
      ? productData.data
      : []
    : [];
  const meta = isGetAllProductSuccess(productData)
    ? productData.meta
    : undefined;

  return (
    <>
      <ProductProvider>
        <ProductDialogs />
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
                Internal Products
              </h2>
              <p className="text-muted-foreground">
                Centralized inventory management and mapping status across
                platforms
              </p>
            </div>
            <ProductPrimaryButtons />
          </div>
          <ProductsTable
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
      </ProductProvider>
    </>
  );
};

export default ProductsPage;
