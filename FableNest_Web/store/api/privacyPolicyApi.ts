import {
  PrivacyPolicyResponseTypes,
  PrivacyPolicyResponseTypesById,
  PrivacyPolicyTypes,
} from "@/types/dashboard2Types";
import baseApi from "./baseApi";

/* =====================
   Types
===================== */

export interface CreatePrivacyPolicyPayload {
  title: string;
  features: string[];
}

export interface UpdatePrivacyPolicyPayload {
  title: string;
  features: string[];
}

/* =====================
   API Slice
===================== */

export const privacyPolicyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createPrivacyPolicy: builder.mutation<any, CreatePrivacyPolicyPayload>({
      query: (payload) => ({
        url: "/privacyPolicy/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),

    fetchAllPrivacyPolicies: builder.query<PrivacyPolicyResponseTypes, any>({
      query: () => ({
        url: "/privacyPolicy/get-all",
        method: "GET",
      }),
      providesTags: ["PrivacyPolicy"],
    }),

    fetchPrivacyPolicyById: builder.query<PrivacyPolicyResponseTypesById, any>({
      query: (id) => ({
        url: `/privacyPolicy/${id}`,
        method: "GET",
      }),
      providesTags: ["PrivacyPolicy"],
    }),

    updatePrivacyPolicyById: builder.mutation<
      any,
      { id: string; payload: UpdatePrivacyPolicyPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/privacyPolicy/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),

    deletePrivacyPolicyById: builder.mutation<any, string>({
      query: (id) => ({
        url: `/privacyPolicy/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PrivacyPolicy"],
    }),
  }),
});

/* =====================
   Hooks Export
===================== */

export const {
  useCreatePrivacyPolicyMutation,
  useFetchAllPrivacyPoliciesQuery,
  useFetchPrivacyPolicyByIdQuery,
  useUpdatePrivacyPolicyByIdMutation,
  useDeletePrivacyPolicyByIdMutation,
} = privacyPolicyApi;
