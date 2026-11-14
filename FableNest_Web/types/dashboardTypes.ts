export type OrderMngType = {
  id: string;
  username: string;
  email: string;
  book_type: string;
  price: number;
  order_id: string;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
};

export type SuspensionType = {
  id: number;
  username: string;
  start_date: string;
  end_date: string;
  suspend: boolean;
};

export type AdminUserType = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
};

// Type for individual feature
export interface Feature {
  id: number;
  feature: string;
}

// Type for policy
export interface Policy {
  id: number;
  policy_title: string;
  policy_number: string;
  features: Feature[];
  last_update: string;
}

export interface Feature {
  id: number;
  feature: string;
}

export interface TermsCondition {
  id: number;
  terms_title: string;
  terms_number: string;
  features: Feature[];
  last_update: string; // ISO date string
}

export interface OngoingPromoTypes {
  id: number;
  discount_percentage: number;
  code: string;
  orders_over: number;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
}
export interface ExpiredPromoTypes {
  id: number;
  discount_percentage: number;
  code: string;
  orders_over: number;
  start_time: string; // ISO date string
  end_time: string; // ISO date string
}

// ================= Dashboard Overview Types ================= //

export interface DashboardOverviewResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  data: DashboardOverviewDataType;
}

// Main data object
export interface DashboardOverviewDataType {
  overviewCards: OverviewCardsType;
  revenueData: RevenueDataItemType[];
  growthLevel: number;
  organizedOrders: OrganizedOrderType[];
}

// Overview cards
export interface OverviewCardsType {
  totalOrder: number;
  totalUser: number;
  totalRevenue: number;
  newUsersThisMonth: number;
}

// Revenue chart data
export interface RevenueDataItemType {
  label: string;
  revenue: number;
}

// Orders
export interface OrganizedOrderType {
  id: string;
  user: OrderUserType;
  bookCount: number;
  totalPrice: number;
  orderStatus: OrderStatusType;
}

// User inside order
export interface OrderUserType {
  firstName: string;
  lastName: string;
  email: string;
}

// Order status union (extend if needed)
export type OrderStatusType = "COMPLETED" | "PENDING";

// ================= End of Dashboard Overview Types ================= //

// ================= Users Types ================= //

// Meta info for pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// User item
export interface UserType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  booksCount: number;
  isOngoingOrder: boolean;
}

// Stats info
export interface UserStats {
  newUsersThisMonth: number;
  totalUsers: number;
}

// Main API response
export interface GetAllUsersResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: UserType[];
  stats: UserStats;
}
// ================= End of Users Types ================= //

// ================= User Details Types ================= //
// Order item (used for both ongoing and past orders)
export interface UserOrder {
  orderId: string;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string; // ISO date string
  bookCount: number;
  bookId: string;
  title: string;
  characterName: string;
  characterAge: number;
  totalChapters: number;
  language: "ENGLISH" | "BANGLA";
  price: number;
}

// User details
export interface UserDetails {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
  ongoingOrders: UserOrder[];
  pastOrders: UserOrder[];
}

// Main API response
export interface GetUserDetailsResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserDetails;
}
// ================= End of User Details Types ================= //

// ================= Order Details Types ================= //
export interface OrderDetailsResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderDetailsDataType;
}

export interface OrderDetailsDataType {
  id: boolean;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  user: OrderUser;
  books: BookDetailsType[];
}

export interface OrderUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface BookDetailsType {
  id: string;
  title: string;
  characterName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  characterAge: number;
  totalChapters: number;
  price: number;
}
// ================= End of Order Details Types ================= //
