"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCreatePaymentMethodMutation, useCreatePaymentMutation } from "@/store/api/paymentApi";
import { useGetCartQuery, CartItemResponse } from "@/store/api/cartApi";
import toast, { Toaster } from "react-hot-toast";




export default function PaymentMethodPage() {
  const t = useTranslations("PaymentMethod");
  const router = useRouter();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const [createPaymentMethod, { isLoading: isCreatingPaymentMethod }] = useCreatePaymentMethodMutation();
  const [createPayment, { isLoading: isCreatingPayment }] = useCreatePaymentMutation();
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    nameOnCard: "",
    saveInfo: false,
  });
  
  // Get cart items from API
  const cartItems: CartItemResponse[] = cartData?.data?.cartItems || [];

  const getInitialShippingAddress = (): {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    saveInfo: boolean;
    code: string;
    apt: string;
    streetAddress: string;
    city: string;
    state: string;
    country: string;
  } | null => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("checkoutShippingAddress");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error("Error parsing shipping address:", e);
        }
      }
    }
    return null;
  };

  const getInitialPromoCode = (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkoutPromoCode") || "";
    }
    return "";
  };

  const [shippingAddress] = useState(getInitialShippingAddress);
  const [promoCode] = useState(getInitialPromoCode);

  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  const promoDiscount = promoCode ? 10.0 : 0;
  // Calculate subtotal based on actual quantities and prices from API
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Calculate total shipping cost (sum of shipping costs for all items)
  const totalShippingCost = cartItems.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
  const total = subtotal + totalShippingCost - promoDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      setCardData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    }
    // Format expiry date as MM/YY
    else if (name === "expiryDate") {
      const formatted = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
      setCardData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    }
    // Limit CVC to 3-4 digits
    else if (name === "securityCode") {
      const formatted = value.replace(/\D/g, "").slice(0, 4);
      setCardData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    }
    else {
      setCardData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? e.target.checked : value,
      }));
    }
  };

  const validateCardData = (): boolean => {
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, "").length < 13) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    
    // Validate expiry date format and ensure it's not in the past
    const [expMonth, expYear] = cardData.expiryDate.split("/");
    if (!expMonth || !expYear) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    
    const month = parseInt(expMonth, 10);
    const year = parseInt(expYear, 10);
    
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    
    // Convert YY to YYYY and check if date is in the past
    const fullYear = 2000 + year;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
    
    if (fullYear < currentYear || (fullYear === currentYear && month < currentMonth)) {
      toast.error("Card expiry date cannot be in the past");
      return false;
    }
    
    if (!cardData.securityCode || cardData.securityCode.length < 3) {
      toast.error("Please enter a valid security code");
      return false;
    }
    if (!cardData.nameOnCard) {
      toast.error("Please enter the name on card");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    // Validate card data
    if (!validateCardData()) {
      return;
    }

    // Check if we have cart items and shipping address
    if (!cartItems || cartItems.length === 0) {
      toast.error("Cart is empty. Please add items to cart.");
      router.push("/checkout");
      return;
    }

    if (!shippingAddress) {
      toast.error("Shipping address is missing. Please fill in address details.");
      router.push("/checkout/address");
      return;
    }

    try {
      // Parse expiry date (MM/YY format)
      const [expMonth, expYear] = cardData.expiryDate.split("/");
      
      if (!expMonth || !expYear) {
        toast.error("Invalid expiry date format");
        return;
      }
      
      const month = parseInt(expMonth, 10);
      const year = parseInt(expYear, 10);
      const fullYear = 2000 + year;
      
      // Validate month and year
      if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
        toast.error("Invalid expiry date");
        return;
      }
      
      // Create payment method via Stripe
      const paymentMethodResult = await createPaymentMethod({
        "card[number]": cardData.cardNumber.replace(/\s/g, ""),
        "card[exp_month]": month.toString().padStart(2, "0"), // Ensure 2-digit month
        "card[exp_year]": fullYear.toString(), // 4-digit year
        "card[cvc]": cardData.securityCode,
        type: "card",
      }).unwrap();

      // Prepare cart items for API
      const cartItemsForApi = cartItems.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));

      // Prepare shipping address for API
      const shippingAddressForApi = {
        firstName: shippingAddress.firstName || "",
        lastName: shippingAddress.lastName || "",
        email: shippingAddress.email || "",
        phoneNumber: shippingAddress.phone || "",
        saveAddress: shippingAddress.saveInfo || false,
        postCode: shippingAddress.code || "",
        buildingNo: shippingAddress.apt || "",
        street: shippingAddress.streetAddress || "",
        city: shippingAddress.city || "",
        state: shippingAddress.state || "",
        country: shippingAddress.country || "",
      };

      // Create payment
      const paymentResult = await createPayment({
        cartItems: cartItemsForApi,
        shippingAddress: shippingAddressForApi,
        paymentMethodId: paymentMethodResult.id,
        promoCode: promoCode || undefined,
      }).unwrap();

      if (paymentResult.success) {
        // Clear checkout data from localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("checkoutCartItems");
          localStorage.removeItem("checkoutShippingAddress");
          localStorage.removeItem("checkoutPromoCode");
        }

        toast.success(paymentResult.message || "Payment successful!");
        
        // Redirect to success page with order ID
        setTimeout(() => {
          router.push(`/checkout/success?orderId=${paymentResult.data.orderId}`);
        }, 1000);
      }
    } catch (error: unknown) {
      const errorData = error as { data?: { message?: string; error?: { message?: string } } };
      const errorMessage = 
        errorData?.data?.message || 
        errorData?.data?.error?.message || 
        "Payment failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const isLoading = isCreatingPaymentMethod || isCreatingPayment;

  return (
    <div className="relative lg:mt-[180px] md:mt-[150px] sm:mt-[100px] mt-20">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#4ade80",
              secondary: "#fff",
            },
          },
          error: {
            duration: 4000,
          },
        }}
      />
      <div className="relative z-10 max-w-[1280px] w-[95%] mx-auto">
        {/* Progress Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 xs:gap-3 sm:gap-4 lg:gap-6">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 whitespace-nowrap">
                {t("step1")}
              </span>
              <div
                style={{ background: gradientInitial }}
                className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full"
              ></div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 whitespace-nowrap">
                {t("step2")}
              </span>
              <div style={{ background: gradientInitial }} className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full"></div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 whitespace-nowrap">
                {t("step3")}
              </span>
              <div
                style={{ background: gradientInitial }}

                className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 font-comme">
          {/* Left Section - Payment Method */}
          <div className="lg:col-span-2">
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 font-jost">
              {t("paymentMethod")}
            </h1> */}

            <div className="space-y-8">
              {/* Payment Method Selection */}
              {/* <div className="flex gap-6 items-center">
                <button
                  onClick={() => setPaymentMethod("stripe")}
                  className={`w-full p-4 rounded-xl border-2 border-[#F28097] transition-all text-left ${paymentMethod === "stripe"
                      ? "border-[#F28097] bg-pink-50"
                      : "border-[#F28097] bg-white/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 border-[#F28097] bg-white/40 flex items-center justify-center ${paymentMethod === "stripe"
                          ? "border-[#F28097]"
                          : "border-[#F28097]"
                        }`}
                    >
                      {paymentMethod === "stripe" && (
                        <div className="w-3 h-3 rounded-full bg-[#F28097]"></div>
                      )}
                    </div>
                    <span
                        className={`font-semibold lg:text-xl text-base ${paymentMethod === "stripe" ? "text-[#635BFF]" : "text-[#636F85]"
                        }`}
                    >
                      {t("stripe")}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === "card"
                      ? "border-[#F28097] bg-pink-50"
                      : "border-[#F28097] bg-white/40"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-[#F28097]" : "border-[#F28097]"
                        }`}
                    >
                      {paymentMethod === "card" && (
                        <div className="w-3 h-3 rounded-full bg-[#F28097]"></div>
                      )}
                    </div>
                    <span
                        className={`font-semibold lg:text-xl text-base ${paymentMethod === "card" ? "text-[#635BFF]" : "text-[#636F85]"
                        }`}
                    >
                      {t("card")}
                    </span>
                  </div>
                </button>
              </div> */}

              {/* Payment Details */}
              <div>
                {/* <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-2 font-jost">{t("payment")}</h2> */}
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 font-jost">{t("payment")}</h2>
                <p className="text-sm text-gray-500 mb-6">
                  {t("allTransactionsSecured")}
                </p>

                <div className="space-y-4">
                  <div className="relative">    
                    <input
                      type="text"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleInputChange}
                      placeholder={t("cardNumber")}
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                    <Lock className="absolute right-4 top-[50%] translate-y-[-50%] w-4 h-4 text-gray-400" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleInputChange}
                        placeholder={t("mmYy")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="securityCode"
                        value={cardData.securityCode}
                        onChange={handleInputChange}
                        placeholder={t("securityCode")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={cardData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder={t("nameOnCard")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      id="saveInfo"
                      checked={cardData.saveInfo}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-none bg-transparent"
                    />
                    <label htmlFor="saveInfo" className="text-sm text-text-secondary">
                      {t("saveInfoNextTime")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl">
              <h2 className="text-xl sm:text-2xl text-text-primary font-jost font-semibold mb-6">
                {t("orderSummary")}
              </h2>

              {isCartLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#F28097]" />
                </div>
              ) : (
                <div className="border border-[#F28097] bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 font-comme space-y-4 mb-6">
                  {/* Items List */}
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <span className="text-sm sm:text-base text-[#636F85]">{t("book")} {index + 1}</span>
                        <span className="text-xs text-gray-400 ml-2">(Qty: {item.quantity})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 line-through">
                          €{item.price.toFixed(2)}
                        </span>
                        <span className="text-sm sm:text-base font-semibold text-[#2D2D2D]">
                          €{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-[#636F85]">{t("shippingCost")}</span>
                    <span className="text-sm sm:text-base font-semibold text-[#2D2D2D]">
                      €{totalShippingCost.toFixed(2)}
                    </span>
                  </div>
                {promoCode && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-[#636F85]">{t("promoCodeOffer")}</span>
                    <span className="text-sm sm:text-base font-semibold text-green-600">
                      -€{promoDiscount.toFixed(2)}
                    </span>
                  </div>
                )}
                  <div className="border-t border-[#F28097] pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-xl font-bold text-[#F28097]">{t("total")}</span>
                      <span className="text-lg sm:text-xl font-bold text-[#F28097]">
                        €{total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                  <span className="text-white text-sm sm:text-lg">
                    {isLoading ? "Processing..." : t("continue")}
                  </span>
                </div>
                <span
                  className="absolute inset-0 rounded-lg transition-all duration-300"
                  style={{ background: gradientInitial }}
                />
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover/login:opacity-100 transition-opacity duration-300"
                  style={{ background: gradientHover }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
      `}</style>
    </div>
  );
}

