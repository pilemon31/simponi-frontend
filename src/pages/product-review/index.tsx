"use client";

import { useCallback } from "react";
import { useSearchParams } from "react-router";

import { Header } from "@/layouts/header";
import { Main } from "@/layouts/main";
import { Search } from "@/components/shared/search";
import { ThemeSwitch } from "@/components/shared/theme-switcher";
import { ConfigDrawer } from "@/components/shared/config-drawer";
import { ProfileDropdown } from "@/components/shared/profile-dropdown";
import { useAuthStore } from "@/stores/auth-store";

import { useProductReviews } from "@/hooks/use-product-reviews";
import { ReviewTable } from "@/components/product-review/review-table";
import type { GetProductReviewsResponse } from "@/types/review.type";
import type { ErrorResponse } from "@/types/response.type";

const isGetReviewsSuccess = (
  response: GetProductReviewsResponse | ErrorResponse | undefined,
): response is GetProductReviewsResponse => response?.status === true;

const ProductReviewPage = () => {
  const user = useAuthStore((state) => state.auth.user);

  const userData = {
    name: user?.name ?? "john",
    email: user?.email ?? "email@admin.com",
    avatar: "/avatars/shadcn.jpg",
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("per_page")) || 10;

  const handlePageChange = useCallback(
    (newPage: number) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set("page", String(newPage));
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const handlePerPageChange = useCallback(
    (newLimit: number) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set("per_page", String(newLimit));
          params.set("page", "1");
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const { data: reviewData } = useProductReviews(page, perPage);
  const data = isGetReviewsSuccess(reviewData)
    ? Array.isArray(reviewData.data)
      ? reviewData.data
      : []
    : [];
  const meta = isGetReviewsSuccess(reviewData) ? reviewData.meta : undefined;

  return (
    <>
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
              Product Reviews
            </h2>
            <p className="text-muted-foreground">
              Review pelanggan beserta tag hasil autotagging dari seluruh produk
            </p>
          </div>
        </div>

        <ReviewTable
          data={data}
          meta={meta}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </Main>
    </>
  );
};

export default ProductReviewPage;
