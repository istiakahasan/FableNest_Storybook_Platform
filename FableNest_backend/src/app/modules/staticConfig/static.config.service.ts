import prisma from "../../lib/prisma"
import ApiError from "../../errors/ApiError";
import status from "http-status"

export const StaticConfigService = {
    seedStaticConfig: async () => {
        const pricingConfig = await prisma.staticConfig.findFirst({
            where: {
                isActive: true
            }
        });

        if (!pricingConfig) {
            await prisma.staticConfig.create({
                data: {
                    bookPrice: 5,
                    shippingCost: 5,
                    supportMail: "rafioulhasan2@gmail.com"
                }
            });
            console.log("Static Config seeded")
        }
    },
    getStaticConfig: async () => {
        const result = await prisma.staticConfig.findFirst({
            where: {
                isActive: true
            }
        });

        if (!result) {
            return null
        }
        return result
    },
    changeShippingFee: async (shippingCost: number) => {
        const config = await prisma.staticConfig.findFirst({
            where: {
                isActive: true
            }
        });

        if (!config) {
            throw new ApiError(status.NOT_FOUND, "Active pricing config not found");
        }

        const result = await prisma.staticConfig.update({
            where: {
                id: config.id
            },
            data: {
                shippingCost
            }
        });

        return result
    },
    changeBookPrice: async (bookPrice: number) => {
        const config = await prisma.staticConfig.findFirst({
            where: {
                isActive: true
            }
        });

        if (!config) {
            throw new ApiError(status.NOT_FOUND, "Active pricing config not found");
        }

        const result = await prisma.staticConfig.update({
            where: {
                id: config.id
            },
            data: {
                bookPrice
            }
        });

        return result
    },
    changeSupportEmail: async (email: string) => {
        const config = await prisma.staticConfig.findFirst({
            where: {
                isActive: true
            }
        });

        if (!config) {
            throw new ApiError(status.NOT_FOUND, "Active pricing config not found");
        }
        const result = await prisma.staticConfig.update({
            where: {
                id: config.id
            },
            data: {
                supportMail: email
            }
        });

        return result

    }


}