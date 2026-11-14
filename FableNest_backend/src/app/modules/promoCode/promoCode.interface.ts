

interface cartItems {
    bookId: string;
    quantity: number
}
interface validatePromoCode {
    cartItems: cartItems[],
    promoCode: string
}