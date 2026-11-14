// src/features/api/baseApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    credentials: "include",
    prepareHeaders: (headers) => {
      // Get access token from localStorage
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("accessToken");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
  tagTypes: ["Dashboard", "Auth", "Promo", "TermsCondition", "PrivacyPolicy", "Payment", "Books", "Cart", "Orders"],
});

// Export hooks for usage in functional components
export default baseApi;
