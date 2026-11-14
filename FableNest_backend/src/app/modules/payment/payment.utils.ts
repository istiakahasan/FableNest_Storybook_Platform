import ApiError from "../../errors/ApiError";
import prisma from "../../lib/prisma";
import status from "http-status"
// validate user
export const validateUser = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true },
    });

    if (!user) {
        throw new ApiError(status.NOT_FOUND, "User not found!");
    }

    return user;
};

export const validateAndApplyPromo = async (
    promoCode: string | undefined,
    totalAmount: number
) => {
    if (!promoCode) {
        return { totalAmount, discount: 0, promoData: null };
    }

    const promoData = await prisma.promoCode.findUnique({
        where: { code: promoCode },
    });

    if (!promoData) {
        throw new ApiError(status.NOT_FOUND, "Promo Code not found!");
    }

    if (!promoData.isActive) {
        throw new ApiError(status.NOT_ACCEPTABLE, "Promo code is not active");
    }

    if (promoData.totalUses >= promoData.useLimit) {
        throw new ApiError(status.NOT_ACCEPTABLE, "Promo code use limit exceeded!");
    }

    if (promoData.endTime < new Date()) {
        throw new ApiError(status.NOT_ACCEPTABLE, "Promo code expired!");
    }
    if (promoData.minimumAmount > totalAmount) {
        throw new ApiError(status.NOT_ACCEPTABLE, "Your total amount could not reach minimum amount!")
    }
    const discount = promoData.discountValue ?? 0;
    const newTotal = Math.max(totalAmount - discount, 0);

    return { totalAmount: newTotal, discount, promoData };
};

//  Get Active Pricing
export const getActivePricing = async () => {
    const pricing = await prisma.staticConfig.findFirst({
        where: { isActive: true },
    });

    return pricing;
};