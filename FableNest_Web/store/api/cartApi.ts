import baseApi from "./baseApi";

export interface CartItemResponse {
  id: string;
  bookId: string;
  title: string;
  image: string;
  quantity: number;
  language: string;
  characterName: string;
  characterAge: number;
  totalPage: number;
  price: number;
  shippingCost: number;
}

export interface GetCartResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    cartItems: CartItemResponse[];
  };
}

export interface AddToCartRequest {
  bookId: string;
}

export interface RemoveFromCartRequest {
  cartItemId: string;
}

export const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<GetCartResponse, void>({
      query: () => ({
        url: "/cart/get-cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    deleteCartItem: builder.mutation<{ success: boolean; message: string }, string>({
      query: (itemId) => ({
        url: `/cart/delete-item/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    addToCart: builder.mutation<{ success: boolean; message: string }, AddToCartRequest>({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<{ success: boolean; message: string }, RemoveFromCartRequest>({
      query: (body) => ({
        url: "/cart/remove",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useDeleteCartItemMutation,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = cartApi;
