import z from "zod";


export const CartValidations = {
    addToCartSchema: z.object({
        bookId: z.string().min(1, "Product Id is required!")
    }),
    removeFromCartSchema: z.object({
        cartItemId: z.string().min(1, "CartItem Id is required!")
    })
}