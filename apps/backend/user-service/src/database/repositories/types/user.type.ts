import { userType } from "@/database/model/user.model";
export interface PaginationType {
  data: userType[];
  total: number;
  currentPage: number;
  totalPage: number;
  limit: number;
  skip: number;
}
export interface createUserType {
  sub: string;
  email: string;
}
export interface QueriesType {
  filter?: string;
  sort?: string;
  limit?: number;
  page?: number;
}
