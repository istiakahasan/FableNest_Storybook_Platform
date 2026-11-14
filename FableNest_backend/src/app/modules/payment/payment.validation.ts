import z from "zod";


const shippingAddressSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),
  lastName: z.string().min(1, "Last name is required").trim(),
  phoneNumber: z.string().min(1, "Phone number is required").trim(),
  saveAddress: z.boolean().default(false),
  postCode: z.string().min(1, "Post code is required").trim(),
  buildingNo: z.string().min(1, "Building number is required").trim(),
  street: z.string().min(1, "Street is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  state: z.string().min(1, "State is required").trim(),
  country: z.string().min(1, "Country is required").trim(),
});

const cartItemSchema = z.object({
  bookId: z.string().min(1, "Book ID is required").trim()
});

const createPaymentValidationSchema = z.object({
  cartItems: z.array(cartItemSchema).min(1, "Cart must have at least one item"),
  shippingAddress: shippingAddressSchema,
  paymentMethodId: z.string().min(1, "Payment method ID is required").trim(),
  promoCode: z.string().optional(), // make optional if user may not provide one
});

export const PaymentValidation = {
  createPaymentValidationSchema,
};
