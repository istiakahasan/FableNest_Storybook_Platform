import ApiError from "../../errors/ApiError";
import status from "http-status";
import prisma from "../../lib/prisma";

export const CartService = {
  // 1, Add or increase quantity
  addItem: async (userId: string, bookId: string, qty: number = 1) => {
    // find active cart for user
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // check if item already exists
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, bookId },
    });

    if (existingItem) {
      return prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + qty },
      });
    }

    // snapshot product price
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new ApiError(status.NOT_FOUND, "Book not found!");

    return prisma.cartItem.create({
      data: {
        cartId: cart.id,
        bookId,
        quantity: qty,
      },
    });
  },

  // 2️⃣ Remove quantity (decrement)
  removeQuantity: async (cartItemId: string, qty: number = 1) => {
    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!item) throw new ApiError(status.NOT_FOUND, "Cart item not found!");

    const newQty = item.quantity - qty;
    if (newQty <= 0) {
      // delete if quantity goes to zero
      return prisma.cartItem.delete({ where: { id: cartItemId } });
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity: newQty },
    });
  },

  // 3️⃣ Delete cart item
  deleteItem: async (cartItemId: string) => {
    const item = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    if (!item) throw new ApiError(status.NOT_FOUND, "Cart item not found!");

    return prisma.cartItem.delete({ where: { id: cartItemId } });
  },
  myCart: async (userId: string) => {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      select: {
        cartItems: {
          select: {
            id: true,
            quantity: true,
            book: {
              select: {
                id: true,
                title: true,
                coverImageUrl: true,
                characterName: true,
                characterAge: true,
                pages: true,
                language: true,
              },
            },
          },
        },
      },
    });

    if (!cart) throw new ApiError(status.NOT_FOUND, "Cart not found!");

    // discountedPrice;
    // nomalPrice;

    // Get active pricing config (single query)
    const bookPrice = await prisma.staticConfig.findFirst({
      where: { isActive: true },
      select: { bookPrice: true, shippingCost: true },
    });

    return {
      cartItems:
        cart?.cartItems.map((item: any) => ({
          id: item.id,
          bookId: item.book.id,
          title: item.book.title,
          image: item.book.coverImageUrl,
          quantity: item.quantity,
          language: item.book?.language,
          characterName: item.book?.characterName,
          characterAge: item.book?.characterAge,
          totalPage: item?.book?.pages?.length,
          price: bookPrice?.bookPrice,
          shippingCost: bookPrice?.shippingCost,
        })) ?? [],
    };
  },
};
