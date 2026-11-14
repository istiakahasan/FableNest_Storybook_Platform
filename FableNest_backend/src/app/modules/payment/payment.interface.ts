export interface Address {
  firstName: string,
  lastName: string,
  phoneNumber: string;
  saveAddress: boolean;
  postCode: string;
  buildingNo: string;
  street: string;
  city: string;
  state: string;
  country: string;
  createdAt: Date;       // DateTime in Prisma maps to JS Date
  updatedAt: Date;
}


export interface ICartItem {
  bookId: string;
  quantity: number;
}
export interface ICreatePaymentRequest {
  cartItems: ICartItem[];
  shippingAddress: Address;
  paymentMethodId: string;
  promoCode: string
}
