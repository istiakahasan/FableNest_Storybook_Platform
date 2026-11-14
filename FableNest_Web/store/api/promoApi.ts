import { PromoCodeResponseTypes } from "@/types/dashboard2Types";
import baseApi from "./baseApi";

/* =====================
   API Slice
===================== */

export const promoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addPromo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/promoCode/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Promo"],
    }),

    applyPromo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/promoCode/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Promo"],
    }),

    getAllPromo: builder.query<PromoCodeResponseTypes, any>({
      query: () => ({
        url: `/promoCode/get-all`,
        method: "GET",
      }),
      providesTags: ["Promo"],
    }),

    getPromoDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/promoCode/details/${id}`,
        method: "GET",
      }),
      providesTags: ["Promo"],
    }),

    updatePromo: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/promoCode/details/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Promo"],
    }),

    deletePromo: builder.mutation<any, string>({
      query: (id) => ({
        url: `/promoCode/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Promo"],
    }),

    activatePromo: builder.mutation<any, string>({
      query: (id) => ({
        url: `/promoCode/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Promo"],
    }),

    deactivatePromo: builder.mutation<any, string>({
      query: (id) => ({
        url: `/promoCode/${id}/deactivate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Promo"],
    }),
  }),
});

/* =====================
   Hooks Export
===================== */

export const {
  useAddPromoMutation,
  useApplyPromoMutation,
  useGetAllPromoQuery,
  useGetPromoDetailsQuery,
  useUpdatePromoMutation,
  useDeletePromoMutation,
  useActivatePromoMutation,
  useDeactivatePromoMutation,
} = promoApi;
