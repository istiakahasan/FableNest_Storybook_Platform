import { Address } from "@prisma/client";
import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status"
export const AddressService = {
    update: async (id: string, payload: Address, userId: string) => {
        const address = await prisma.address.findUnique({
            where: {
                id
            }
        });

        if (!address) {
            throw new ApiError(status.NOT_FOUND, "Address not found With this id")
        }

        if (address.userId !== userId) {
            throw new ApiError(status.UNAUTHORIZED, "You are not authorized to update this!")
        }
        const result = await prisma.address.update({
            where: {
                id
            },
            data: {
                ...payload
            }
        });
        return result
    },
    delete: async (id: string, userId: string) => {
        const address = await prisma.address.findUnique({
            where: {
                id
            }
        });

        if (!address) {
            throw new ApiError(status.NOT_FOUND, "Address not found With this id")
        }

        if (address.userId !== userId) {
            throw new ApiError(status.UNAUTHORIZED, "You are not authorized to update this!")
        }
        const result = await prisma.address.delete({
            where: {
                id
            }
        });
        return {
            message: "Address Deleted!"
        }
    },
}