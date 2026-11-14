"use client";

import AuthLayout from "@/components/authentication/AuthLayout";
import SuccessAuthForm from "@/components/authentication/SuccessAuthForm";
import { useTranslations } from "next-intl";

export default function LoginSuccessPage() {
  const t = useTranslations("SuccessAuthForm");
  return (
    <AuthLayout>
      <SuccessAuthForm
        title={t("loginSuccessful")}
        subtitle={t("loginSubtitle")}
        buttonText={t("continue")}
        redirectPath="/"
      />
    </AuthLayout>
  );
}
