"use client";

import AuthLayout from "@/components/authentication/AuthLayout";
import SuccessAuthForm from "@/components/authentication/SuccessAuthForm";
import { useTranslations } from "next-intl";

export default function PasswordResetSuccessPage() {
  const t = useTranslations("SuccessAuthForm");
  return (
    <AuthLayout>
      <SuccessAuthForm
        title={t("passwordResetSuccessful")}
        subtitle={t("passwordResetSubtitle")}
        buttonText={t("continue")}
        redirectPath="/auth/login"
      />
    </AuthLayout>
  );
}

