export interface QueriesType {
  limit?: number;
  page?: number;
  filter?: string;
  search?: string;
  sort?: string;
}
export interface ProductCreateRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  description?: string;
}
export interface ProductUpdateRequest {
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  description?: string;
}
export interface Production {
  _id?: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  barcode?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
