import baseApi from "./baseApi";

export interface OrderItem {
  id: string;
  quantity: number;
  book: {
    id: string;
    title: string;
    coverImageUrl: string;
    pdfUrl: string | null;
  };
}

export interface Order {
  id: string;
  orderStatus: string;
  totalAmount: number;
  createdAt: string;
  orderItem: OrderItem[];
}

export interface MyOrdersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Order[];
}

export const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrders: builder.query<MyOrdersResponse, void>({
      query: () => ({
        url: "/order/my-orders",
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetMyOrdersQuery } = orderApi;
