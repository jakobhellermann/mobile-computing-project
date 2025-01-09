export type OrdersPerMonthStat = {
  month: string;
  orders: number;
};

export type OverviewStats = {
  totalOrders: number;
  totalProducts: number;
  totalStock: number;
  totalSold: number;
  totalRevenue: number;
};
