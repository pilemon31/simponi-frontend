import { Headphones, Smartphone, Laptop, Box } from "lucide-react";

export const SyncStatuses = [
  {
    label: "Synced",
    value: "Synced" as const,
    variant: "success",
  },
  {
    label: "Low Stock",
    value: "Low Stock" as const,
    variant: "danger",
  },
  {
    label: "Unmapped",
    value: "Unmapped" as const,
    variant: "warning",
  },
];

export const ProductIcons = {
  Headphones,
  Smartphone,
  Laptop,
  Box,
};
