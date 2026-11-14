import { OrderStatus, PaymentStatus } from "@prisma/client";
import prisma from "../../lib/prisma";
import QueryBuilder from "../../builder/QueryBuilder";
import ApiError from "../../errors/ApiError";
import status from "http-status";

export const DashboardService = {
  overview: async (query: Record<string, unknown>) => {
    const { period = "7days", growth = "weekly" } = query;
    const totalUser = await prisma.user.count();
    const totalOrder = await prisma.order.count();
    // revenue
    const totalRevenueRaw = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: PaymentStatus.COMPLETED },
    });
    const totalRevenue = Number((totalRevenueRaw._sum.amount || 0).toFixed(2));

    // new user this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); //first day of month
    startOfMonth.setHours(0, 0, 0, 0); //start of day

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // first day of next month

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth, // greater than or equal start of month
          lt: endOfMonth, // less than start of next month
        },
      },
    });

    // generate revenue

    const now = new Date();

    let revenueData: { label: string; revenue: number }[] = [];
    if (period === "7days") {
      // last 7 days
      const pastWeekStart = new Date();
      pastWeekStart.setDate(now.getDate() - 6);
      pastWeekStart.setHours(0, 0, 0, 0);

      const payments = await prisma.payment.findMany({
        where: {
          paymentStatus: PaymentStatus.COMPLETED,
          createdAt: { gte: pastWeekStart },
        },
        select: { amount: true, createdAt: true },
      });

      const dailyRevenue: { [key: string]: number } = {};
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split("T")[0];
        dailyRevenue[key] = 0;
      }

      payments.forEach((p) => {
        const key = p.createdAt.toISOString().split("T")[0];
        if (dailyRevenue[key] !== undefined) dailyRevenue[key] += p.amount;
      });

      revenueData = Object.keys(dailyRevenue)
        .sort()
        .map((date) => ({
          label: date,
          revenue: Number(dailyRevenue[date].toFixed(2)),
        }));
    } else if (period === "6months" || period === "1year") {
      const months = period === "6months" ? 6 : 12;
      const monthlyRevenue: { [key: string]: number } = {};

      for (let i = months - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`;
        monthlyRevenue[key] = 0;
      }

      const payments = await prisma.payment.findMany({
        where: {
          paymentStatus: PaymentStatus.COMPLETED,
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth() - (months - 1), 1),
          },
        },
        select: { amount: true, createdAt: true },
      });

      payments.forEach((p) => {
        const key = `${p.createdAt.getFullYear()}-${(p.createdAt.getMonth() + 1).toString().padStart(2, "0")}`;
        if (monthlyRevenue[key] !== undefined) monthlyRevenue[key] += p.amount;
      });

      revenueData = Object.keys(monthlyRevenue)
        .sort()
        .map((month) => ({
          label: month,
          revenue: Number(monthlyRevenue[month].toFixed(2)),
        }));
    }

    let growthLevel = 0;

    if (growth === "weekly") {
      // --- WEEKLY USERS ---
      const startOfCurrentWeek = new Date(now);
      startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Sunday
      startOfCurrentWeek.setHours(0, 0, 0, 0);

      const startOfPreviousWeek = new Date(startOfCurrentWeek);
      startOfPreviousWeek.setDate(startOfPreviousWeek.getDate() - 7);
      const endOfPreviousWeek = new Date(startOfCurrentWeek);
      endOfPreviousWeek.setMilliseconds(-1);

      const currentWeekUsers = await prisma.user.count({
        where: { createdAt: { gte: startOfCurrentWeek } },
      });

      const previousWeekUsers = await prisma.user.count({
        where: {
          createdAt: { gte: startOfPreviousWeek, lte: endOfPreviousWeek },
        },
      });

      const weeklyGrowth = previousWeekUsers
        ? ((currentWeekUsers - previousWeekUsers) / previousWeekUsers) * 100
        : 100;

      growthLevel = weeklyGrowth;
    } else if (growth === "monthly") {
      // --- MONTHLY USERS ---
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );
      const startOfPreviousMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1,
      );
      const endOfPreviousMonth = new Date(startOfCurrentMonth);
      endOfPreviousMonth.setMilliseconds(-1);

      const currentMonthUsers = await prisma.user.count({
        where: { createdAt: { gte: startOfCurrentMonth } },
      });

      const previousMonthUsers = await prisma.user.count({
        where: {
          createdAt: { gte: startOfPreviousMonth, lte: endOfPreviousMonth },
        },
      });

      const monthlyGrowth = previousMonthUsers
        ? ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100
        : 100;

      growthLevel = monthlyGrowth;
    } else if (growth === "yearly") {
      // --- YEARLY USERS ---
      const startOfCurrentYear = new Date(now.getFullYear(), 0, 1);
      const startOfPreviousYear = new Date(now.getFullYear() - 1, 0, 1);
      const endOfPreviousYear = new Date(startOfCurrentYear);
      endOfPreviousYear.setMilliseconds(-1);

      const currentYearUsers = await prisma.user.count({
        where: { createdAt: { gte: startOfCurrentYear } },
      });

      const previousYearUsers = await prisma.user.count({
        where: {
          createdAt: { gte: startOfPreviousYear, lte: endOfPreviousYear },
        },
      });

      const yearlyGrowth = previousYearUsers
        ? ((currentYearUsers - previousYearUsers) / previousYearUsers) * 100
        : 100;

      growthLevel = yearlyGrowth;
    }

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        orderStatus: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        orderItem: {
          // select: {
          //     book: {
          //         select: {
          //             style: true,

          //         }
          //     }
          // }
          select: {
            id: true,
            quantity: true,
            bookId: true, 
          },
        },
      },
    });
    const staticConfig = await prisma.staticConfig.findFirst({
      where: { isActive: true },
    });

    const organizedOrders = recentOrders.map((order) => {
      const totalPrice = order.orderItem.reduce((sum, item) => {
        return sum + (staticConfig?.bookPrice || 0); // handle optional book
      }, 0);

      return {
        id: order.id,
        user: order.user,
        bookCount: order.orderItem.length,
        totalPrice,
        orderStatus: order.orderStatus,
      };
    });

    return {
      overviewCards: {
        totalOrder,
        totalUser,
        totalRevenue,
        newUsersThisMonth,
      },
      revenueData,
      growthLevel,
      organizedOrders,
    };
  },
  allUsers: async (query: Record<string, unknown>) => {
    const userQuery = new QueryBuilder(prisma.user, query)
      .search(["firstName", "lastName", "email"])
      .paginate()
      .select({
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        books: true,
        orders: true,
      });

    const [users, meta] = await Promise.all([
      userQuery.execute(),
      userQuery.countTotal(),
    ]);
    // new user this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); //first day of month
    startOfMonth.setHours(0, 0, 0, 0); //start of day

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1); // first day of next month

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth, // greater than or equal start of month
          lt: endOfMonth, // less than start of next month
        },
      },
    });
    const result = users.map((user: any) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      booksCount: user.books.length,
      isOngoingOrder: user.orders.some(
        (order: any) => order.orderStatus === OrderStatus.PENDING,
      ),
    }));

    return {
      data: result,
      meta,
      stats: {
        newUsersThisMonth,
        totalUsers: meta.total,
      },
    };
  },
  // userDetails: async (id: string) => {

  //     const result = await prisma.user.findUnique({
  //         where: {
  //             id
  //         },
  //         select: {
  //             id: true,
  //             firstName: true,
  //             lastName: true,
  //             email: true,
  //             role: true,
  //             isBlocked: true,
  //             orders: {
  //                 select: {
  //                     id: true,
  //                     orderStatus: true,
  //                     createdAt: true,
  //                     orderItem: {
  //                         select: {
  //                             book: {
  //                                 select: {
  //                                     id: true,
  //                                     title: true,
  //                                     characterName: true,
  //                                     characterAge: true,
  //                                     totalChapters: true,
  //                                     language: true,
  //                                     price: true
  //                                 }
  //                             }
  //                         }
  //                     }
  //                 }
  //             }
  //         }
  //     });
  //     if (!result) {
  //         throw new ApiError(status.NOT_FOUND, "User not found!")
  //     }
  //     const transformOrders = (orders: any[], status: OrderStatus) =>
  //         orders
  //             .filter(order => order.orderStatus === status)
  //             .map(order => {
  //                 const { id: bookId, ...rest } = order.orderItem?.[0]?.book || {};
  //                 const bookCount = order.orderItem?.length || 0;
  //                 return {
  //                     id: order.id,
  //                     orderStatus: order.orderStatus,
  //                     createdAt: order.createdAt,
  //                     bookCount,
  //                     bookId,
  //                     ...rest
  //                 };
  //             });

  //     const transformedResult = {
  //         user: {
  //             id: result.id,
  //             firstName: result.firstName,
  //             lastName: result.lastName,
  //             email: result.email,
  //             role: result.role,
  //             isBlocked: result.isBlocked,
  //         },
  //         ongoingOrders: transformOrders(result.orders, OrderStatus.PENDING),
  //         pastOrders: transformOrders(result.orders, OrderStatus.COMPLETED)
  //     }
  //     return transformedResult
  // }
  userDetails: async (id: string) => {
    const result = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isBlocked: true,
        orders: {
          select: {
            id: true,
            orderStatus: true,
            createdAt: true,
            orderItem: {
              select: {
                book: {
                  select: {
                    id: true,
                    title: true,
                    characterName: true,
                    characterAge: true,
                    language: true,
                    gender: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!result) {
      throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    const transformOrders = (orders: any[], status: OrderStatus) =>
      orders
        .filter((order) => order.orderStatus === status)
        .map((order) => {
          const items =
            order.orderItem?.map((oi: any) => {
              const book = oi.book || {};
              return {
                id: book.id,
                title: book.title,
                characterName: book.characterName,
                gender: book.gender,
                characterAge: book.characterAge,
                totalChapters: book.totalChapters,
                language: book.language,
                price: book.price,
              };
            }) || [];

          return {
            id: order.id,
            createdAt: order.createdAt,
            orderStatus: order.orderStatus,
            books: items, // now an array of all books in this order
          };
        });

    return {
      user: {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        role: result.role,
        isBlocked: result.isBlocked,
      },
      ongoingOrders: transformOrders(result.orders, OrderStatus.PENDING),
      pastOrders: transformOrders(result.orders, OrderStatus.COMPLETED),
    };
  },
};
