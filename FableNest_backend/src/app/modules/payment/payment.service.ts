import Stripe from "stripe";
import status from "http-status";
import prisma from "../../lib/prisma";
import { ICreatePaymentRequest } from "./payment.interface";
import ApiError from "../../errors/ApiError";
import { stripe } from "../../helpers/stripe";
import { validateAndApplyPromo, validateUser } from "./payment.utils";
import { Currency, OrderStatus, PaymentStatus } from "@prisma/client";

export const createPayment = async (
    userId: string,
    payload: ICreatePaymentRequest
) => {
    const { cartItems, shippingAddress, paymentMethodId, promoCode } = payload;

    // Validate cart items exist
    if (!cartItems?.length) {
        throw new ApiError(status.BAD_REQUEST, "Cart is empty");
    }

    // Validate user
    const user = await validateUser(userId);

    // Get active pricing config (single query)
    const staticConfig = await prisma.staticConfig.findFirst({
        where: { isActive: true },
        select: { bookPrice: true, shippingCost: true }
    });

    const basePrice = staticConfig?.bookPrice ?? 5;
    const shippingPrice = staticConfig?.shippingCost ?? 10;

    // Fetch and validate books
    const bookIds = cartItems.map(item => item.bookId);
    const books = await prisma.book.findMany({
        where: { id: { in: bookIds } },
        select: { id: true }
    });

    if (books.length !== bookIds.length) {
        throw new ApiError(status.BAD_REQUEST, "Some books are not available");
    }

    const bookSet = new Set(books.map(b => b.id));

    // Validate all cart items and calculate subtotal
    let subtotal = 0;
    for (const item of cartItems) {
        if (!bookSet.has(item.bookId)) {
            throw new ApiError(status.BAD_REQUEST, "Invalid book in cart");
        }
        if (item.quantity <= 0) {
            throw new ApiError(status.BAD_REQUEST, "Invalid quantity");
        }
        subtotal += basePrice * item.quantity;
    }

    // Apply promo code discount
    const { totalAmount: subtotalWithDiscount, discount, promoData } = await validateAndApplyPromo(
        promoCode,
        subtotal
    );
    const totalAmount = subtotalWithDiscount + shippingPrice;

    // Execute payment transaction
    const result = await prisma.$transaction(async tx => {
        // Create order record
        const order = await tx.order.create({
            data: {
                userId,
                totalAmount,
                orderStatus: OrderStatus.PENDING,
                discount,
                shippingAddress: JSON.stringify(shippingAddress)
            }
        });

        // Create order items
        await tx.orderItem.createMany({
            data: cartItems.map(item => ({
                orderId: order.id,
                bookId: item.bookId,
                quantity: item.quantity,
            }))
        });

        // Create payment record
        const payment = await tx.payment.create({
            data: {
                orderId: order.id,
                userId,
                amount: totalAmount,
                currency: Currency.USD,
                paymentStatus: PaymentStatus.PENDING
            }
        });

        // Save shipping address if requested
        if (shippingAddress?.saveAddress) {
            const { saveAddress, ...addressData } = shippingAddress;

            await tx.address.upsert({
                where: {
                    // Assuming you have a unique constraint, e.g., by userId + some address field
                    userId: userId,
                },
                update: {
                    ...addressData,
                },
                create: {
                    ...addressData,
                    userId,
                },
            });
        }


        // Update promo code usage
        if (promoData) {
            await tx.promoCode.update({
                where: { id: promoData.id },
                data: { totalUses: { increment: 1 } }
            });
        }

        // Process Stripe payment
        let paymentIntent: Stripe.PaymentIntent;
        try {
            paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(totalAmount * 100),
                currency: "usd",
                payment_method: paymentMethodId,
                confirm: true,
                automatic_payment_methods: {
                    enabled: true,
                    allow_redirects: "never"
                },
                receipt_email: user.email,
                metadata: {
                    orderId: order.id,
                    paymentId: payment.id,
                    userId
                },
                description: `Order #${order.id} - ${cartItems.length} book(s)`,
            });
        } catch (err: any) {
            // Mark order and payment as failed
            await Promise.all([
                tx.order.update({
                    where: { id: order.id },
                    data: { orderStatus: OrderStatus.CANCELLED }
                }),
                tx.payment.update({
                    where: { id: payment.id },
                    data: { paymentStatus: PaymentStatus.FAILED }
                })
            ]);

            throw new ApiError(
                status.PAYMENT_REQUIRED,
                err.message || "Payment processing failed"
            );
        }

        // Update payment with Stripe ID
        await tx.payment.update({
            where: { id: payment.id },
            data: { stripePaymentId: paymentIntent.id }
        });

        // Handle payment status
        if (paymentIntent.status === "succeeded") {
            await Promise.all([
                tx.order.update({
                    where: { id: order.id },
                    data: { orderStatus: OrderStatus.PROCESSING }
                }),
                tx.payment.update({
                    where: { id: payment.id },
                    data: { paymentStatus: PaymentStatus.COMPLETED }
                })
            ]);

            return {
                success: true,
                orderId: order.id,
                paymentId: payment.id,
                message: "Payment successful! Your order has been confirmed."
            };
        }

        if (paymentIntent.status === "requires_action") {
            return {
                success: false,
                orderId: order.id,
                requiresAction: true,
                clientSecret: paymentIntent.client_secret!,
                message: "Additional authentication required"
            };
        }

        // Handle payment failure
        await Promise.all([
            tx.order.update({
                where: { id: order.id },
                data: { orderStatus: OrderStatus.CANCELLED }
            }),
            tx.payment.update({
                where: { id: payment.id },
                data: { paymentStatus: PaymentStatus.FAILED }
            })
        ]);

        throw new ApiError(
            status.PAYMENT_REQUIRED,
            paymentIntent.last_payment_error?.message || "Payment failed"
        );
    }, {
        maxWait: 5000,
        timeout: 10000
    });

    return result;
};

export const PaymentService = {
    createPayment
};