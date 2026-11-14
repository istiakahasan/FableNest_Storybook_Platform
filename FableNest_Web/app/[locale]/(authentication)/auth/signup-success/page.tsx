"use client";

import AuthLayout from "@/components/authentication/AuthLayout";
import SuccessAuthForm from "@/components/authentication/SuccessAuthForm";
import { useTranslations } from "next-intl";

export default function SignupSuccessPage() {
  const t = useTranslations("SuccessAuthForm");
  return (
    <AuthLayout>
      <SuccessAuthForm
        title={t("signUpSuccessful")}
        subtitle={t("signUpSubtitle")}
        buttonText={t("continue")}
        redirectPath="/auth/login"
      />
    </AuthLayout>
  );
}

