import { TermsConditionResponseTypes } from "@/types/dashboard2Types";
import baseApi from "./baseApi";

/* =====================
   Types
===================== */

export interface CreateTermsConditionPayload {
  title: string;
  features: string[];
}

export interface UpdateTermsConditionPayload {
  title: string;
  features: string[];
}

/* =====================
   API Slice
===================== */

export const termsConditionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTermsCondition: builder.mutation<any, CreateTermsConditionPayload>({
      query: (payload) => ({
        url: "/terms-condition/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["TermsCondition"],
    }),

    fetchAllTermsConditions: builder.query<TermsConditionResponseTypes, any>({
      query: () => ({
        url: "/terms-condition/get-all",
        method: "GET",
      }),
      providesTags: ["TermsCondition"],
    }),

    fetchTermsConditionsById: builder.query<TermsConditionResponseTypes, any>({
      query: (id) => ({
        url: `/terms-condition/${id}`,
        method: "GET",
      }),
      providesTags: ["TermsCondition"],
    }),

    updateTermsConditionById: builder.mutation<
      any,
      { id: string; payload: UpdateTermsConditionPayload }
    >({
      query: ({ id, payload }) => ({
        url: `/terms-condition/update/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["TermsCondition"],
    }),

    deleteTermsConditionById: builder.mutation<any, string>({
      query: (id) => ({
        url: `/terms-condition/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TermsCondition"],
    }),
  }),
});

/* =====================
   Hooks Export
===================== */

export const {
  useCreateTermsConditionMutation,
  useFetchTermsConditionsByIdQuery,
  useFetchAllTermsConditionsQuery,
  useUpdateTermsConditionByIdMutation,
  useDeleteTermsConditionByIdMutation,
} = termsConditionApi;
