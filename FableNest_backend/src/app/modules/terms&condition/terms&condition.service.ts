import prisma from "../../lib/prisma";
import ApiError from "../../errors/ApiError";
import status from "http-status";
import { TermsCondition } from "@prisma/client";

export const TermsConditionService = {
    create: async (payload: TermsCondition) => {
        const term = await prisma.termsCondition.create({ data: payload });
        return term;
    },

    getById: async (id: string) => {
        const term = await prisma.termsCondition.findUnique({ where: { id } });
        if (!term) throw new ApiError(status.NOT_FOUND, "Terms & Condition not found!");
        return term;
    },

    getAll: async () => {
        return prisma.termsCondition.findMany({ orderBy: { createdAt: "desc" } });
    },

    update: async (id: string, payload: Partial<TermsCondition>) => {
        const existingTerm = await prisma.termsCondition.findUnique({
            where: {
                id
            }
        });
        if (!existingTerm) {
            throw new ApiError(status.NOT_FOUND, "Terms & Conditions not found!")
        }
        const features = Array.from(new Set([...(payload.features ?? []), ...existingTerm.features]));
        const term = await prisma.termsCondition.update({
            where: {
                id
            },
            data: {
                ...payload,
                features
            }
        });

        return term;
    },

    delete: async (id: string) => {
        const existingTerm = await prisma.termsCondition.findUnique({
            where: {
                id
            }
        });
        if (!existingTerm) {
            throw new ApiError(status.NOT_FOUND, "Terms & Conditions not found!")
        }
        const term = await prisma.termsCondition.delete({ where: { id } });
        return term;
    },
};
