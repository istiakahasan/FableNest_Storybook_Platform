export type UserDataType = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "ADMIN";
  isBlocked: boolean;
};

export type BooksDataType = {
  id: string;
  title: string;
  characterName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  characterAge: number;
  totalChapters: number;
  language: "ENGLISH" | "BANGLA" | string;
  price: number;
};

export type OngoingOrderDataType = {
  id: string;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  books: BooksDataType[];
};

export type PastOrderDataType = {
  id: string;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  books: BooksDataType[];
};

export type UserDetailsDataType = {
  user: UserDataType;
  ongoingOrders: OngoingOrderDataType[];
  pastOrders: PastOrderDataType[];
};

export type UserDetailsResponseType = {
  success: boolean;
  statusCode: number;
  message: string;
  data: UserDetailsDataType;
};

export type OrderDetailsDataType = {
  id: string;
  orderStatus: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  user: UserDataType;
  books: BooksDataType[];
};

export type OrderDetailsResponseType = {
  success: boolean;
  statusCode: number;
  message: string;
  data: OrderDetailsDataType;
};

// Order type
// Order status enum (recommended for strict typing)
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

// User info inside order
export interface OrderUser {
  firstName: string;
  lastName: string;
  email: string;
}

// Single order item
export interface OrderItemType {
  id: string;
  user: OrderUser;
  bookCount: number;
  orderStatus: OrderStatus;
  totalAmount: number;
}

// Pagination meta
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// Full API response type
export interface AllOrdersResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: OrderItemType[];
}

// =============================================================================================

export type UserRoleType = "ADMIN" | "USER";

export interface MyProfileDataType {
  id: string;
  firstName: string;
  lastName: string;
  role: UserRoleType;
  email: string;
  profileImage: string;
  mustChangePassword: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MyProfileResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  data: MyProfileDataType;
}

// get users data type
export type GetUsersType = {
  id: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "USER";
  email: string;
  profileImage: string;
  mustChangePassword: boolean;
  isBlocked: boolean;
  suspensionStarts: string | null;
  suspensionEnds: string | null;
  createdAt: string;
  updatedAt: string;
};
export interface GetUsersResponseType {
  success: boolean;
  statusCode: number;
  message: string;
  meta: PaginationMeta;
  data: GetUsersType[];
}

// ===================================

export interface TermsConditionTypes {
  id: string;
  title: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TermsConditionResponseTypes {
  success: boolean;
  statusCode: number;
  message: string;
  data: TermsConditionTypes[];
}

export interface PrivacyPolicyTypes {
  id: string;
  title: string;
  features: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PrivacyPolicyResponseTypes {
  success: boolean;
  statusCode: number;
  message: string;
  data: TermsConditionTypes[];
}

export interface PrivacyPolicyResponseTypesById {
  success: boolean;
  statusCode: number;
  message: string;
  data: TermsConditionTypes;
}

export interface PromoCodeTypes {
  id: string;
  code: string;
  discountValue: number;
  minimumAmount: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  useLimit: number;
  totalUses: number;
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface PromoCodeResponseTypes {
  success: boolean;
  statusCode: number;
  message: string;
  data: PromoCodeTypes[];
}
