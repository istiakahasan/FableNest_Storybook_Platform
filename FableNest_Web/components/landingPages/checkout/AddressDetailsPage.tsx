"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetCartQuery, CartItemResponse } from "@/store/api/cartApi";


export default function AddressDetailsPage() {
  const t = useTranslations("AddressDetails");
  const router = useRouter();
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    country: "",
    firstName: "",
    lastName: "",
    streetAddress: "",
    apt: "",
    city: "",
    state: "",
    code: "",
    saveInfo: false,
  });

  const gradientInitial ="linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
  const gradientHover ="linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

  // Get cart items from API
  const cartItems: CartItemResponse[] = cartData?.data?.cartItems || [];
  
  // Get promo code from localStorage
  const getPromoCode = (): string => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("checkoutPromoCode") || "";
    }
    return "";
  };
  const promoCode = getPromoCode();
  const appliedPromo = promoCode.trim() !== "";
  const promoDiscount = appliedPromo ? 10.0 : 0;
  
  // Calculate subtotal based on actual quantities and prices from API
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Calculate total shipping cost (sum of shipping costs for all items)
  const totalShippingCost = cartItems.reduce((sum, item) => sum + (item.shippingCost * item.quantity), 0);
  const total = subtotal + totalShippingCost - promoDiscount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleContinue = () => {
    // Store shipping address in localStorage for payment page
    if (typeof window !== "undefined") {
      localStorage.setItem("checkoutShippingAddress", JSON.stringify(formData));
    }
    router.push("/checkout/payment");
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
              <div 
                style={{ background: gradientInitial }} 
              className="w-24 sm:w-32 md:w-40 lg:w-[232px] h-[6px] sm:h-[8px] lg:h-[10px] rounded-full"></div>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 font-comme">
          {/* Left Section - Address Details */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8 font-jost">
              {t("addressDetails")}
            </h1>

            <div className="space-y-8">
              {/* Contact Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2D2D] mb-4">{t("contact")}</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t("email")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t("phone")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {t("emailDescription")}
                  </p>
                </div>
              </div>

              {/* Delivery Section */}
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#2D2D2D] mb-4">{t("delivery")}</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white appearance-none"
                    >
                      <option value="" disabled>{t("countryRegion")}</option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="NZ">New Zealand</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="IT">Italy</option>
                      <option value="ES">Spain</option>
                      <option value="NL">Netherlands</option>
                      <option value="BE">Belgium</option>
                      <option value="CH">Switzerland</option>
                      <option value="AT">Austria</option>
                      <option value="SE">Sweden</option>
                      <option value="NO">Norway</option>
                      <option value="DK">Denmark</option>
                      <option value="FI">Finland</option>
                      <option value="PL">Poland</option>
                      <option value="PT">Portugal</option>
                      <option value="IE">Ireland</option>
                      <option value="GR">Greece</option>
                      <option value="CZ">Czech Republic</option>
                      <option value="HU">Hungary</option>
                      <option value="RO">Romania</option>
                      <option value="BG">Bulgaria</option>
                      <option value="HR">Croatia</option>
                      <option value="SK">Slovakia</option>
                      <option value="SI">Slovenia</option>
                      <option value="EE">Estonia</option>
                      <option value="LV">Latvia</option>
                      <option value="LT">Lithuania</option>
                      <option value="JP">Japan</option>
                      <option value="KR">South Korea</option>
                      <option value="CN">China</option>
                      <option value="IN">India</option>
                      <option value="BD">Bangladesh</option>
                      <option value="PK">Pakistan</option>
                      <option value="SG">Singapore</option>
                      <option value="MY">Malaysia</option>
                      <option value="TH">Thailand</option>
                      <option value="PH">Philippines</option>
                      <option value="ID">Indonesia</option>
                      <option value="VN">Vietnam</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="IL">Israel</option>
                      <option value="ZA">South Africa</option>
                      <option value="EG">Egypt</option>
                      <option value="BR">Brazil</option>
                      <option value="MX">Mexico</option>
                      <option value="AR">Argentina</option>
                      <option value="CL">Chile</option>
                      <option value="CO">Colombia</option>
                      <option value="PE">Peru</option>
                      <option value="TR">Turkey</option>
                      <option value="RU">Russia</option>
                      <option value="UA">Ukraine</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-[50%] translate-y-[-50%] w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder={t("firstName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder={t("lastName")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      placeholder={t("streetAddress")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      name="apt"
                      value={formData.apt}
                      onChange={handleInputChange}
                      placeholder={t("aptBuildingEtc")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder={t("city")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder={t("stateProvince")}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={t("postalZipCode")}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8880F2] text-sm bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      id="saveInfo"
                      checked={formData.saveInfo}
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
                  {appliedPromo && (
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
                className="relative w-full px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
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

