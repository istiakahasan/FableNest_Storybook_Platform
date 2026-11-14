import status from "http-status";
import ApiError from "../../errors/ApiError";
import prisma from "../../lib/prisma";
import { PromoCode } from "@prisma/client";

export const PromoCodeService = {
    createPromoCode: async (payload: PromoCode) => {
        const { code } = payload;
        const existing = await prisma.promoCode.findUnique({ where: { code } });
        if (existing) {
            throw new ApiError(status.CONFLICT, "Promo code already exists!");
        }
        const promo = await prisma.promoCode.create({
            data: payload
        });
        return promo;
    },

    getAll: async () => {
        const result = await prisma.promoCode.findMany();
        return result
    },

    applyPromoCode: async (payload: validatePromoCode) => {
        const promo = await prisma.promoCode.findUnique({
            where: { code: payload.promoCode },
        });

        if (!promo) {
            throw new ApiError(status.NOT_FOUND, "Promo Code not Exists");
        }

        if (promo.totalUses >= promo.useLimit) {
            throw new ApiError(status.NOT_ACCEPTABLE, "Promo code use limit exceeded!");
        }

        if (promo.endTime < new Date()) {
            throw new ApiError(status.NOT_ACCEPTABLE, "Promo code expired");
        }

        if (!promo.isActive) {
            throw new ApiError(status.NOT_ACCEPTABLE, "PromoCode is not Active");
        }

        /* ─────────────── Fetch Active Pricing ─────────────── */
        const pricing = await prisma.staticConfig.findFirst({
            where: { isActive: true },
        });

        let totalAmount = 0;

        /* ─────────────── Calculate Total WITH Quantity ─────────────── */
        for (const cart of payload.cartItems) {
            const book = await prisma.book.findUnique({
                where: { id: cart.bookId },
            });

            if (!book) {
                throw new ApiError(
                    status.NOT_FOUND,
                    `Book not found with id ${cart.bookId}`
                );
            }

            const unitPrice = pricing?.bookPrice ?? 5;
            const quantity = cart.quantity ?? 1;

            totalAmount += unitPrice * quantity;
        }

        /* ─────────────── Minimum Amount Check ─────────────── */
        if (promo.minimumAmount > totalAmount) {
            throw new ApiError(
                status.NOT_ACCEPTABLE,
                "Your total amount did not reach the minimum amount!"
            );
        }

        /* ─────────────── Apply Discount ─────────────── */
        const discount = Number(
            (totalAmount * (Number(promo.discountValue) / 100)).toFixed(2)
        );

        const newAmount = Number((totalAmount - discount).toFixed(2));

        return {
            discount,
            newAmount,
        };
    },


    getPromoCodeById: async (id: string) => {
        const promo = await prisma.promoCode.findUnique({ where: { id } });
        if (!promo) {
            throw new ApiError(status.NOT_FOUND, "Promo code not found!");
        }
        return promo;
    },

    updatePromoCode: async (id: string, data: Partial<PromoCode>) => {
        const existingPromo = await prisma.promoCode.findUnique({
            where: {
                id
            }
        });
        if (!existingPromo) {
            throw new ApiError(status.NOT_FOUND, "Promo Code not found!")
        }
        const promo = await prisma.promoCode.update({
            where: { id },
            data,
        });
        return promo;
    },

    deletePromoCode: async (id: string) => {
        const existingPromo = await prisma.promoCode.findUnique({
            where: {
                id
            }
        });
        if (!existingPromo) {
            throw new ApiError(status.NOT_FOUND, "Promo Code not found!")
        }
        const promo = await prisma.promoCode.delete({ where: { id } });
        return promo;
    },
    activatePromoCode: async (id: string) => {
        const promo = await prisma.promoCode.findUnique({ where: { id } });
        if (!promo) {
            throw new ApiError(status.NOT_FOUND, "Promo code not found!");
        }

        if (promo.isActive) {
            throw new ApiError(status.BAD_REQUEST, "Promo code is already active!");
        }

        const updated = await prisma.promoCode.update({
            where: { id },
            data: { isActive: true },
        });

        return {
            message: "Promo code activated successfully!",
            promo: updated,
        };
    },

    deactivatePromoCode: async (id: string) => {
        const promo = await prisma.promoCode.findUnique({ where: { id } });
        if (!promo) {
            throw new ApiError(status.NOT_FOUND, "Promo code not found!");
        }

        if (!promo.isActive) {
            throw new ApiError(status.BAD_REQUEST, "Promo code is already inactive!");
        }

        const updated = await prisma.promoCode.update({
            where: { id },
            data: { isActive: false },
        });

        return {
            message: "Promo code deactivated successfully!",
            promo: updated,
        };
    },
};
