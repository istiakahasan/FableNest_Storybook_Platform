import Navbar from "@/components/shared/Navbar";
import "./landing.css";
import BackgroundWrapper from "@/components/landingPages/BackgroundWrapper";
import Footer from "@/components/shared/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function LandingPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();
  
  return (
    <NextIntlClientProvider messages={messages}>
      <BackgroundWrapper>
        <div className="min-h-screen zoom-80 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-hidden">{children}</main>
          <Footer />
        </div>
      </BackgroundWrapper>
    </NextIntlClientProvider>
  );
}
