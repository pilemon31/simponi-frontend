import { useQuery } from "@tanstack/react-query";
import { useActiveShopId } from "@/lib/shop";
import { ProductReviewApi } from "@/services/product-review.service";

export const useProductReviews = (page = 1, perPage = 10) => {
  const activeShopId = useActiveShopId();

  return useQuery({
    queryKey: ["product-reviews", activeShopId, page, perPage],
    queryFn: () => ProductReviewApi.getAll(page, perPage),
  });
};
