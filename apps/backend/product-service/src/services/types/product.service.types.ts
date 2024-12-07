export interface QueriesType {
  limit?: number;
  page?: number;
  filter?: {
    [key: string]: number | string | { [key: string]: number | string };
  };
  search?: string;
}
