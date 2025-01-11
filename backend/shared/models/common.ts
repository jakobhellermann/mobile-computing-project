export type Page<T> = {
  page: number;
  pageSize: number;
  total: number;
  data: T[];
};

export type PageRequest = {
  page: number;
  pageSize: number;
};
