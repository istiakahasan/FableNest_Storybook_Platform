import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  return (
    <DashboardLayoutWrapper>
      <NextIntlClientProvider messages={messages}>
        {children}
      </NextIntlClientProvider>
    </DashboardLayoutWrapper>
  );
}
