import express from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.routes";
import { PromoCodeRoutes } from "../modules/promoCode/promoCode.routes";
import { TermsConditionRoutes } from "../modules/terms&condition/terms&condition.routes";
import { PrivacyPolicyRoutes } from "../modules/privacyPolicy/privacyPolicy.routes";
import { BookRoutes } from "../modules/book/book.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { DashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { OrderRoutes } from "../modules/order/order.routes";
import { FlipbookRoutes } from "../modules/flipbook/flipbook.routes";
import { CartRoutes } from "../modules/cart/cart.routes";
import { AddressRoutes } from "../modules/address/address.routes";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/promoCode",
    route: PromoCodeRoutes,
  },
  {
    path: "/terms-condition",
    route: TermsConditionRoutes,
  },
  {
    path: "/privacyPolicy",
    route: PrivacyPolicyRoutes,
  },
  {
    path: "/book",
    route: BookRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/flip-book",
    route: FlipbookRoutes
  },
  {
    path: "/cart",
    route: CartRoutes
  },
  {
    path: "/address",
    route: AddressRoutes
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
