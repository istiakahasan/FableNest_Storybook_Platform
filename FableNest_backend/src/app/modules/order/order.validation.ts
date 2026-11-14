import { OrderStatus } from "@prisma/client";
import z from "zod";


export const changeOrderStatus = z.object({
    orderStatus: z.nativeEnum(OrderStatus)
})