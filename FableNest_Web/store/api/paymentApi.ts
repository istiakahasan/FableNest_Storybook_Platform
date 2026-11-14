import baseApi from "./baseApi";

/* =====================
   Request / Response Types
===================== */

export interface CreatePaymentMethodRequest {
  "card[number]": string;
  "card[exp_month]": string;
  "card[exp_year]": string;
  "card[cvc]": string;
  type: "card";
}

export interface CreatePaymentMethodResponse {
  id: string;
  object: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export interface CartItemRequest {
  bookId: string;
  quantity: number;
}

export interface ShippingAddressRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  saveAddress: boolean;
  postCode: string;
  buildingNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface CreatePaymentRequest {
  cartItems: CartItemRequest[];
  shippingAddress: ShippingAddressRequest;
  paymentMethodId: string;
  promoCode?: string;
}

export interface CreatePaymentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    success: boolean;
    orderId: string;
    message: string;
  };
}

/* =====================
   API Endpoints
===================== */

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Payment Method (Stripe API - direct call)
    createPaymentMethod: builder.mutation<CreatePaymentMethodResponse, CreatePaymentMethodRequest>({
      queryFn: async (body) => {
        try {
          // Convert object to URL-encoded form data
          const formData = new URLSearchParams();
          formData.append("card[number]", body["card[number]"]);
          formData.append("card[exp_month]", body["card[exp_month]"]);
          formData.append("card[exp_year]", body["card[exp_year]"]);
          formData.append("card[cvc]", body["card[cvc]"]);
          formData.append("type", body.type);

          // Note: In production, this should be done via backend API for security
          // Using secret key here is for development only
          const stripeSecretKey = process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || "";
          
          const response = await fetch("https://api.stripe.com/v1/payment_methods", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              "Authorization": `Bearer ${stripeSecretKey}`,
            },
            body: formData.toString(),
          });

          if (!response.ok) {
            const error = await response.json();
            return { error: { status: response.status, data: error } };
          }

          const data = await response.json();
          return { data };
        } catch (error) {
          return { error: { status: "FETCH_ERROR", error: String(error) } };
        }
      },
    }),

    // Create Payment
    createPayment: builder.mutation<CreatePaymentResponse, CreatePaymentRequest>({
      query: (body) => ({
        url: "/payment/create",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreatePaymentMethodMutation,
  useCreatePaymentMutation,
} = paymentApi;
