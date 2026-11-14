"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const gradientInitial =
  "linear-gradient(103deg, #443BC9 5%, rgba(242, 128, 151, 0.58) 94.56%)";
const gradientHover =
  "linear-gradient(103deg, rgba(242, 128, 151, 0.58), #443BC9)";

export default function ContactContent() {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="relative max-w-[1280px] mx-auto w-[95%] mt-20 sm:mt-28 md:mt-32 lg:mt-[180px] mb-12 sm:mb-16 md:mb-20">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center lg:items-center gap-8 sm:gap-10 md:gap-12 lg:gap-16">
          {/* Left Side - Contact Form */}
          <div className="w-full lg:w-1/2">
            <div
              className="bg-[#FFFFFF80] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg"
            >
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-jost mb-3 sm:mb-4">
                {t("title")}
              </h1>
              <p className="text-sm sm:text-base text-text-sec font-comme mb-6 sm:mb-8 md:mb-10">
                {t("description")}
              </p>

              {/* Contact Form */}
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="fullName"
                    className="block text-sm sm:text-base font-semibold text-text-primary font-comme"
                  >
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder={t("fullName")}
                    className="w-full p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:border-transparent transition-all font-comme placeholder:text-gray-400"
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm sm:text-base font-semibold text-text-primary font-comme"
                  >
                    {t("emailAddress")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t("emailAddress")}
                    className="w-full p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:border-transparent transition-all font-comme placeholder:text-gray-400"
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm sm:text-base font-semibold text-text-primary font-comme"
                  >
                    {t("phoneNumber")}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("phoneNumber")}
                    className="w-full p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:border-transparent transition-all font-comme placeholder:text-gray-400"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm sm:text-base font-semibold text-text-primary font-comme"
                  >
                    {t("message")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("message")}
                    rows={2}
                    className="w-full p-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28097] focus:border-transparent transition-all font-comme placeholder:text-gray-400 resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="relative w-1/3 px-6 py-3 text-base font-semibold rounded-lg transition-all duration-300 group/login font-dynapuff"
                  >
                    <div className="inline-flex items-center justify-center gap-3 relative z-10 w-full">
                      <span className="text-white text-wrap">{t("sendMessage")}</span>
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
              </form>
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[400px] lg:max-w-[500px] aspect-square">
              <div className="relative w-full h-full">
                <Image
                  src="/logos/blackLogo.png"
                  alt="Face2Toon Logo"
                  fill
                  className="object-contain hvr-float-shadow"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

