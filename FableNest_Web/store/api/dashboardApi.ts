import baseApi from "./baseApi";

import {
  DashboardOverviewResponseType,
  GetAllUsersResponseType,
} from "@/types/dashboardTypes";

import {
  AllOrdersResponseType,
  GetUsersResponseType,
  MyProfileResponseType,
  OrderDetailsResponseType,
  UserDetailsResponseType,
} from "@/types/dashboard2Types";

/* -------------------------------------------------------------------------- */
/*                                  Constants                                 */
/* -------------------------------------------------------------------------- */

const DASHBOARD_TAG = "Dashboard";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type UserRole = "ADMIN" | "USER";
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface PaginationQuery {
  [key: string]: string;
}

interface ChangeUserRolePayload {
  userId: string;
  role: UserRole;
}

interface ChangeOrderStatusPayload {
  orderId: string;
  orderStatus: OrderStatus;
}

/* -------------------------------------------------------------------------- */
/*                                   API Slice                                */
/* -------------------------------------------------------------------------- */

export const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /* ------------------------------ Dashboard ------------------------------ */

    getOverview: builder.query<DashboardOverviewResponseType, PaginationQuery>({
      query: (params) => ({
        url: "/dashboard/overview",
        method: "GET",
        params,
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    /* -------------------------------- Users -------------------------------- */

    getAllUsers: builder.query<GetAllUsersResponseType, PaginationQuery>({
      query: (params) => ({
        url: "/dashboard/all-users",
        method: "GET",
        params,
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    getUsers: builder.query<GetUsersResponseType, PaginationQuery>({
      query: (params) => ({
        url: "/user/get-all",
        method: "GET",
        params,
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    getUserDetails: builder.query<UserDetailsResponseType, { userId: string }>({
      query: ({ userId }) => ({
        url: `/dashboard/user/details/${userId}`,
        method: "GET",
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    changeUserRole: builder.mutation<any, ChangeUserRolePayload>({
      query: ({ userId, role }) => ({
        url: `/user/change-role/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),

    blockUser: builder.mutation<any, ChangeUserRolePayload>({
      query: ({ userId, role }) => ({
        url: `/user/block-user/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),

    unblockUser: builder.mutation<any, ChangeUserRolePayload>({
      query: ({ userId, role }) => ({
        url: `/user/unblock-user/${userId}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),

    addAdmin: builder.mutation<
      any,
      { firstName: string; lastName: string; email: string }
    >({
      query: (body) => ({
        url: `/user/add-admin`,
        method: "POST",
        body,
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),

    /* -------------------------------- Orders ------------------------------- */

    getAllOrders: builder.query<AllOrdersResponseType, PaginationQuery>({
      query: (params) => ({
        url: "/order/get-all",
        method: "GET",
        params,
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    getOrderDetails: builder.query<
      OrderDetailsResponseType,
      { orderId: string }
    >({
      query: ({ orderId }) => ({
        url: `/order/admin/details/${orderId}`,
        method: "GET",
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    changeOrderStatus: builder.mutation<any, ChangeOrderStatusPayload>({
      query: ({ orderId, orderStatus }) => ({
        url: `/order/change-status/${orderId}`,
        method: "POST",
        body: { orderStatus },
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),

    /* -------------------------------- Profile ------------------------------ */

    getProfile: builder.query<MyProfileResponseType, void>({
      query: () => ({
        url: "/user/my-profile",
        method: "GET",
      }),
      providesTags: [DASHBOARD_TAG],
    }),

    updateProfile: builder.mutation<any, FormData>({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: [DASHBOARD_TAG],
    }),
  }),
});

/* -------------------------------------------------------------------------- */
/*                                   Hooks                                    */
/* -------------------------------------------------------------------------- */

export const {
  useGetOverviewQuery,
  useGetAllUsersQuery,
  useGetUserDetailsQuery,
  useChangeUserRoleMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useChangeOrderStatusMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useAddAdminMutation,
} = packageApi;
