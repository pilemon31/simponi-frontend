import type { Pagination, SuccessResponse } from "./response.type";

export type VendorData = {
  id: string;
  name: string;
  email: string;
  phone: string;        // dari VendorResponse.PhoneNumber -> json:"phone"
  address: string;
  image_url: string;
  description: string;
};

export type VendorListResponse = SuccessResponse<{
  data: VendorData[];
  pagination: Pagination;
}>;

export type VendorDetailResponse = SuccessResponse<VendorData>;

export type CreateVendorRequest = {
  name: string;
  email?: string;
  phone_number: string;
  address?: string;
  image_url?: string;
  description?: string;
};

export type UpdateVendorRequest = {
  name: string;
  email?: string;
  phone_number: string; 
  address?: string;
  image_url?: string;
  description?: string;
};