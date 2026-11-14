"use client";

import React, { useState } from "react";
import { ChevronDown, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

interface PromoCode {
  id: number;
  discount: number;
  code: string;
  ordersOver: number;
  timeLeft: string;
}

// Mock promo codes data
const promoCodesData: PromoCode[] = [
  {
    id: 1,
    discount: 12,
    code: "NEW10",
    ordersOver: 30,
    timeLeft: "30 H 25 Min Left",
  },
  {
    id: 2,
    discount: 12,
    code: "NEW10",
    ordersOver: 30,
    timeLeft: "30 H 25 Min Left",
  },
];

export default function MyAccountContent() {
  const t = useTranslations("MyAccountContent");
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    userName: "Al Muntakim",
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressData, setAddressData] = useState({
    country: "",
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    apt: "",
    city: "",
    state: "",
    code: "",
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setProfileData({
      userName: "Al Muntakim",
      email: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleSaveProfile = () => {
    setIsEditMode(false);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="relative max-w-[1280px] mx-auto w-[95%] mt-20 sm:mt-28 md:mt-32 lg:mt-[180px] mb-12 sm:mb-16 md:mb-20">
      <div className="relative z-10">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2D2D2D] font-jost mb-2">
            {t("myProfile")}
          </h1>
          <p className="text-sm sm:text-base text-[#636F85] font-comme">
            {t("reviewItemProceed")}
          </p>
        </div>

        {/* Top Section - My Profile and Shipping Address */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 sm:mb-16">
          {/* My Profile Card */}
          <div className="bg-[#FFFFFF80] flex flex-col justify-center items-center rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
            <div>
              <div
                className={`flex mb-8 ${
                  isEditMode ? "justify-between" : "justify-center"
                }`}
              >
                <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] font-jost">
                  {isEditMode ? t("editProfile") : ""}
                </h2>
                {!isEditMode && (
                  <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#F28097] rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xl sm:text-2xl font-bold font-jost">
                      {t("user")}
                    </span>
                  </div>
                )}
              </div>

              {!isEditMode ? (
                <>
                  <div className="flex flex-col items-center mb-8">
                    <p className="text-lg sm:text-xl font-semibold text-[#2D2D2D] font-jost">
                      {profileData.userName}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="group relative w-full px-6 py-3 text-white font-bold rounded-lg transition-all duration-300 overflow-hidden font-dynapuff text-sm sm:text-base"
                  >
                    <div className="flex items-center justify-center gap-2 relative z-10 w-full pointer-events-none">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.9999 11.9991C18.447 11.9991 18 12.4472 18 12.999V20.9991C18 21.5501 17.5519 21.999 17.0001 21.999H3C2.44795 21.999 2.00006 21.5501 2.00006 20.9991V6.99902C2.00006 6.44805 2.44795 5.99909 3 5.99909H11.0001C11.553 5.99909 12 5.55105 12 4.99915C12 4.4471 11.553 3.99902 11.0001 3.99902H3C1.34602 3.99902 0 5.34504 0 6.99902V20.9991C0 22.6531 1.34602 23.9991 3 23.9991H17.0001C18.654 23.9991 20.0001 22.6531 20.0001 20.9991V12.999C20.0001 12.4461 19.5529 11.9991 18.9999 11.9991Z"
                          fill="white"
                        />
                        <path
                          d="M9.37515 11.0882C9.30565 11.158 9.25805 11.2466 9.23819 11.3431L8.53122 14.8793C8.49826 15.0432 8.55025 15.2121 8.66818 15.3312C8.71473 15.3776 8.76995 15.4143 8.83071 15.4394C8.89147 15.4644 8.95656 15.4772 9.02228 15.4771C9.05415 15.4771 9.08729 15.4742 9.12025 15.4672L12.6553 14.7603C12.7532 14.7401 12.8422 14.6932 12.9113 14.6231L20.8233 6.71108L17.2882 3.17624L9.37515 11.0882ZM23.2672 0.731285C22.2923 -0.243762 20.7062 -0.243762 19.7321 0.731285L18.3482 2.11518L21.8832 5.65021L23.2672 4.26613C23.7392 3.79518 23.9992 3.1671 23.9992 2.49913C23.9992 1.83116 23.7392 1.20313 23.2672 0.731285Z"
                          fill="white"
                        />
                      </svg>

                      <span className="mt-1">
                        {t("editProfileInformation")}
                      </span>
                    </div>
                    <span
                      className="absolute inset-0 rounded-lg transition-all duration-300"
                      style={{ background: gradientInitial }}
                    />
                    <span
                      className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: gradientHover }}
                    />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-8">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-[#F28097] rounded-full flex items-center justify-center">
                      <span className="text-white text-xl sm:text-2xl font-bold font-jost">
                        {t("user")}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      name="userName"
                      value={profileData.userName}
                      onChange={handleProfileChange}
                      placeholder={t("userName")}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme"
                    />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder={t("email")}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme"
                    />
                    <input
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleProfileChange}
                      placeholder={t("newPassword")}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme"
                    />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleProfileChange}
                      placeholder={t("confirmNewPassword")}
                      className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="flex-1 px-6 py-3 text-[#F28097] border border-[#F28097] bg-[#FFFFFF66] font-bold rounded-lg hover:bg-[#FFF0F3] transition-all duration-300 font-dynapuff text-sm"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      className="group relative flex-1 px-6 py-3 text-white font-bold rounded-lg transition-all duration-300 overflow-hidden font-dynapuff text-sm"
                    >
                      <span className="relative z-10 pointer-events-none">
                        {t("save")}
                      </span>
                      <span
                        className="absolute inset-0 rounded-lg transition-all duration-300"
                        style={{ background: gradientInitial }}
                      />
                      <span
                        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ background: gradientHover }}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-[#FFFFFF80] rounded-[20px] sm:rounded-[24px] p-6 sm:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2D2D] font-jost mb-6">
              {t("shippingAddress")}
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <select
                  name="country"
                  value={addressData.country}
                  onChange={handleAddressChange}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme appearance-none pr-10 text-[#9CA3AF]"
                >
                  <option defaultValue="" disabled>
                    {t("countryRegion")}
                  </option>
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
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="firstName"
                  value={addressData.firstName}
                  onChange={handleAddressChange}
                  placeholder={t("firstName")}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
                />
                <input
                  type="text"
                  name="lastName"
                  value={addressData.lastName}
                  onChange={handleAddressChange}
                  placeholder={t("lastName")}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
                />
              </div>

              <input
                type="tel"
                name="phone"
                value={addressData.phone}
                onChange={handleAddressChange}
                placeholder={t("phoneNumber")}
                className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
              />

              <input
                type="text"
                name="streetAddress"
                value={addressData.streetAddress}
                onChange={handleAddressChange}
                placeholder={t("streetAddress")}
                className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
              />

              <input
                type="text"
                name="apt"
                value={addressData.apt}
                onChange={handleAddressChange}
                placeholder={t("aptBuildingEtc")}
                className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  name="city"
                  value={addressData.city}
                  onChange={handleAddressChange}
                  placeholder={t("city")}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
                />
                <div className="relative">
                  <select
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme appearance-none pr-8 text-[#9CA3AF]"
                  >
                    <option defaultValue="" disabled>
                      {t("state")}
                    </option>
                    <option value="ny">New York</option>
                    <option value="ca">California</option>
                    <option value="tx">Texas</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <input
                  type="text"
                  name="code"
                  value={addressData.code}
                  onChange={handleAddressChange}
                  placeholder={t("code")}
                  className="w-full px-4 py-3 text-sm bg-white border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8880F2] focus:border-transparent transition-all font-comme placeholder:text-[#9CA3AF]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button
                type="button"
                className="flex-1 px-4 py-3 text-[#F28097] border border-[#F28097] bg-[#FFFFFF66] font-bold rounded-lg hover:bg-[#FFF0F3] transition-all duration-300 font-dynapuff text-sm whitespace-nowrap"
              >
                {t("addNewAddress")}
              </button>
              <button
                type="button"
                className="group relative flex-1 px-4 py-3 text-white font-bold rounded-lg transition-all duration-300 overflow-hidden font-dynapuff text-sm whitespace-nowrap"
              >
                <span className="relative z-10 pointer-events-none text-wrap">
                  {t("updateShippingAddress")}
                </span>
                <span
                  className="absolute inset-0 rounded-lg transition-all duration-300"
                  style={{ background: gradientInitial }}
                />
                <span
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: gradientHover }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Promo Code Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] font-jost mb-2">
            {t("promoCode")}
          </h2>
          <p className="text-sm sm:text-base text-[#636F85] font-comme mb-6 sm:mb-8">
            {t("promoCodeDescription")}
          </p>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {promoCodesData.map((promo) => (
                <div
                  key={promo.id}
                  className="bg-[#FFFFFF80] rounded-[20px] p-5 sm:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex gap-4">
                    <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 bg-[#E8544F] p-3 rounded-xl flex items-center justify-center">
                      <span className="text-white text-xl sm:text-2xl font-bold font-jost">
                        {promo.discount}% off
                      </span>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div className="space-y-1">
                        <p className="text-base sm:text-lg font-semibold text-[#2D2D2D] font-comme">
                          {t("code")}:{" "}
                          <span className="font-mono">{promo.code}</span>
                        </p>
                        <p className="text-sm text-[#636F85] font-comme">
                          {t("ordersOver")} €{promo.ordersOver}
                        </p>
                        <p className="text-sm text-[#636F85] font-comme">
                          {t("timeLeft")} {promo.timeLeft}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyCode(promo.code)}
                        className="self-end mt-3 px-4 py-2 bg-[#8880F2] text-white text-sm font-bold rounded-lg hover:bg-[#7770E0] transition-colors flex items-center gap-2 font-dynapuff"
                      >
                        <Copy className="w-4 h-4" />
                        {t("copy")}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="hidden lg:block absolute -right-12 xl:-right-20 top-1/2 transform -translate-y-1/2 w-40 h-40 xl:w-52 xl:h-52">
              <div className="relative w-full h-full">
                <Image
                  src="/gift.png"
                  alt="Gift box"
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
