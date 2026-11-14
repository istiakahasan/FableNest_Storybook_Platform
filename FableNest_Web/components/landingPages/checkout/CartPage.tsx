"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Loader2, Minus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { 
  useGetCartQuery, 
  useDeleteCartItemMutation, 
  useAddToCartMutation,
  useRemoveFromCartMutation,
  CartItemResponse 
} from "@/store/api/cartApi";
import { toast } from "sonner";

export default function CartPage() {
  const t = useTranslations("CartPage");
  const router = useRouter();
  const { data: cartData, isLoading, refetch } = useGetCartQuery();
  const [deleteCartItem, { isLoading: isDeleting }] = useDeleteCartItemMutation();
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [removeFromCart, { isLoading: isRemoving }] = useRemoveFromCartMutation();
  
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  // Get cart items from API
  const cartItems: CartItemResponse[] = cartData?.data?.cartItems || [];



  const gradientInitial =
    "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover =
    "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  const promoDiscount = appliedPromo ? 10.0 : 0;
  // Calculate subtotal based on actual quantities and prices from API
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Calculate total shipping cost (sum of shipping costs for all items)
  const totalShippingCost = cartItems.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
  const total = subtotal + totalShippingCost - promoDiscount;

  const handleRemoveItem = async (itemId: string) => {
    try {
      await deleteCartItem(itemId).unwrap();
      toast.success("Item removed from cart");
      refetch(); // Refresh cart data
    } catch (error: unknown) {
      console.error("Error removing item:", error);
      const errorData = error as { data?: { message?: string }; message?: string };
      const errorMessage = errorData?.data?.message || errorData?.message || "Failed to remove item";
      toast.error(errorMessage);
    }
  };

  const handleIncreaseQuantity = async (item: CartItemResponse) => {
    setUpdatingItemId(item.id);
    try {
      await addToCart({ bookId: item.bookId }).unwrap();
      toast.success("Quantity increased");
      refetch();
    } catch (error: unknown) {
      console.error("Error increasing quantity:", error);
      const errorData = error as { data?: { message?: string }; message?: string };
      const errorMessage = errorData?.data?.message || errorData?.message || "Failed to increase quantity";
      toast.error(errorMessage);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecreaseQuantity = async (item: CartItemResponse) => {
    if (item.quantity <= 1) {
      // If quantity is 1, remove the item completely
      await handleRemoveItem(item.id);
      return;
    }

    setUpdatingItemId(item.id);
    try {
      await removeFromCart({ cartItemId: item.id }).unwrap();
      toast.success("Quantity decreased");
      refetch();
    } catch (error: unknown) {
      console.error("Error decreasing quantity:", error);
      const errorData = error as { data?: { message?: string }; message?: string };
      const errorMessage = errorData?.data?.message || errorData?.message || "Failed to decrease quantity";
      toast.error(errorMessage);
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setAppliedPromo(true);
    }
  };

  const handleContinue = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Store cart items and promo code in localStorage for payment page
    if (typeof window !== "undefined") {
      // Format cart items for payment API
      const checkoutItems = cartItems.map(item => ({
        bookId: item.bookId,
        quantity: item.quantity,
      }));
      
      localStorage.setItem("checkoutCartItems", JSON.stringify(checkoutItems));
      localStorage.setItem("checkoutPromoCode", promoCode);
    }
    router.push("/checkout/address");
  };

  return (
    <div className="relative lg:mt-[180px] md:mt-[150px] sm:mt-[100px] mt-20">
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
              <div className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full bg-white"></div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm sm:text-base lg:text-xl font-semibold text-gray-800 whitespace-nowrap">
                {t("step3")}
              </span>
              <div className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full bg-white"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Section - Cart */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-4xl text-text-primary font-jost font-semibold mb-2">{t("cart")}</h1>
              <p className="text-sm sm:text-base text-text-sec font-comme">
                {t("reviewItemProceed")}
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#F28097]" />
              </div>
            )}

            {/* Empty Cart */}
            {!isLoading && cartItems.length === 0 && (
              <div className="border border-[#F28097] bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-8 text-center">
                <p className="text-text-primary font-comme text-lg">
                  Your cart is empty
                </p>
              </div>
            )}

            {/* Cart Items */}
            {!isLoading && cartItems.map((item) => (
              <div
                key={item.id}
                className="border border-[#F28097] bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 relative"
              >
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  disabled={isDeleting}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove item"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <X className="w-5 h-5 text-white" />
                  )}
                </button>

                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Book Cover */}
                  <div className="relative mx-auto sm:mx-0 w-[121px] h-32 sm:h-[145px] rounded-xl shrink-0">
                    {item.image && item.image !== "PENDING" ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-xl"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-400 text-sm">Pending</span>
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-2xl font-jost font-semibold text-text-primary mb-2">
                      {item.title}
                    </h3>
                    
                    {/* Book Information */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 text-sm sm:text-base text-text-sec font-comme">
                      <span>
                        {t("name")}: <span className="text-text-primary font-semibold">{item.characterName}</span>
                      </span>
                      <span>
                        {t("age")}: <span className="text-text-primary font-semibold">{item.characterAge}</span>
                      </span>
                      <span>
                        {t("page")}: <span className="text-text-primary font-semibold">28</span>
                      </span>
                      <span>
                        {t("language")}: <span className="text-text-primary font-semibold">{item.language}</span>
                      </span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-text-sec font-comme text-sm sm:text-base">
                        {t("quantity") || "Quantity"}:
                      </span>
                      <div className="flex items-center gap-2 border border-[#F28097] rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecreaseQuantity(item)}
                          disabled={updatingItemId === item.id || isRemoving}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-[#F28097] hover:text-white text-[#F28097] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          {updatingItemId === item.id && isRemoving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Minus className="w-4 h-4" />
                          )}
                        </button>
                        <span className="px-4 py-1.5 sm:px-6 sm:py-2 bg-white text-text-primary font-semibold text-sm sm:text-base min-w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleIncreaseQuantity(item)}
                          disabled={updatingItemId === item.id || isAdding}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white hover:bg-[#F28097] hover:text-white text-[#F28097] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          {updatingItemId === item.id && isAdding ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="text-xl sm:text-2xl font-semibold text-text-primary font-jost mb-2">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button className="text-[#F28097] text-sm font-semibold font-comme hover:underline">
                      {t("edit")}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Books Section */}
            <div className="border border-[#F28097] bg-[#F2809733] backdrop-blur-lg  rounded-2xl shadow-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl text-text-primary font-jost font-semibold text-center mb-4">
                {t("addPersonalizedBooks")}
              </h2>
              <button className="w-full sm:w-auto px-6 py-3 rounded-xl  border-2 border-[#F28097] text-[#F28097] font-semibold bg-[#FFFFFF66] hover:bg-pink-50 transition-colors flex items-center justify-center gap-2 font-dynapuff mx-auto">
                <Plus className="w-5 h-5" />
                {t("addMorePersonalizedBooks")}
              </button>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1 mt-9">
            <div className=" rounded-2xl sticky top-4">
              <h2 className="text-xl sm:text-2xl text-text-primary font-jost font-semibold mb-6">
                {t("orderSummary")}
              </h2>

              <div className="border border-[#F28097] bg-white/50 backdrop-blur-lg rounded-2xl shadow-lg p-4 sm:p-6 font-comme">
                {/* Items List */}
                <div className="space-y-3 mb-6">
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
                </div>

                {/* Promo Code */}
                <div className="mb-6 pb-6 border-b border-[#F28097]">
                  <p className="text-sm sm:text-base font-semibold text-[#2D2D2D] mb-2">
                    {t("gotPromoCode")}
                  </p>
                  <div className="flex gap-2 bg-white border border-text-sec px-4 py-[14px] rounded-xl">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder={t("code")}
                      className="flex-1 outline-none border-none text-sm"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className=""
                    >
                      {t("apply")}
                    </button>
                  </div>
                  {appliedPromo && (
                    <p className="text-sm text-green-600 mt-2">{t("promoCodeApplied")}</p>
                  )}
                </div>

                {/* Total */}
                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg sm:text-xl font-bold text-[#F28097]">{t("total")}</span>
                    <span className="text-lg sm:text-xl font-bold text-[#F28097]">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff mt-6"
              >
                <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                  <span className="text-white text-sm sm:text-lg">{t("continue")}</span>
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

