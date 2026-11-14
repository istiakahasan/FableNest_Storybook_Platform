import { OrderStatus } from "@prisma/client";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import prisma from "../../lib/prisma";
import status from "http-status";

export const OrderService = {
  detailsAdmin: async (id: string) => {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!order) {
      throw new ApiError(status.NOT_FOUND, "Order not found!");
    }

    const orderDetails = await prisma.order.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        orderStatus: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isBlocked: true,
          },
        },
        orderItem: {
          select: {
            book: {
              select: {
                id: true,
                title: true,
                characterName: true,
                gender: true,
                characterAge: true,
                language: true,
              },
            },
          },
        },
      },
    });

    const details = {
      id: orderDetails?.id,
      orderStatus: orderDetails?.orderStatus,
      user: orderDetails?.user,
      createAt: orderDetails?.createdAt,
      books: orderDetails?.orderItem.map((item: any) => ({
        id: item.book.id,
        title: item.book.title,
        characterName: item.book.characterName,
        gender: item.book.gender,
        characterAge: item.book.characterAge,
        totalChapters: item.book.totalChapters,
        language: item.book.language,
      })),
    };

    return details;
  },

  getAll: async (query: Record<string, unknown>) => {
    const ordersQuery = new QueryBuilder(prisma.order, query)
      .search([""])
      .paginate()
      .select({
        id: true,
        orderStatus: true,
        totalAmount: true,
        orderItem: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      });

    const [orders, meta] = await Promise.all([
      ordersQuery.execute(),
      ordersQuery.countTotal(),
    ]);

    const result = orders.map((order: any) => ({
      id: order.id,
      user: order.user,
      bookCount: order.orderItem.length,
      orderStatus: order.orderStatus,
      totalAmount: order.totalAmount,
    }));

    return {
      data: result,
      meta,
    };
  },

  changeOrderStatus: async (id: string, orderStatus: OrderStatus) => {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      throw new ApiError(status.NOT_FOUND, "orderData not found!");
    }

    await prisma.order.update({
      where: {
        id,
      },
      data: {
        orderStatus,
      },
    });

    return {
      message: "Order Status updated!",
    };
  },
  getMyOrder: async (userId: string) => {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderStatus: true,
        totalAmount: true,
        createdAt: true,

        orderItem: {
          select: {
            id: true,
            quantity: true,
            book: {
              select: {
                id: true,
                title: true,
                coverImageUrl: true,
                pdfUrl: true,
              },
            },
          },
        },
      },
    });

    return orders;
  },
};
