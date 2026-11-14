"use client";

import PolicyPageContent from "@/components/landingPages/PolicyPageContent";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations("TermsCondition");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShouldRotate(true));

    // Cleanup function
    return () => {
      dispatch(setShouldRotate(false));
    };
  }, [dispatch]);

  const sections = [
    {
      title: t("section1Title"),
      description: t("section1Description"),
    },
    {
      title: t("section2Title"),
      description: t("section2Description"),
    },
    {
      title: t("section3Title"),
      description: t("section3Description"),
    },
    {
      title: t("section4Title"),
      description: t("section4Description"),
    },
    {
      title: t("section5Title"),
      description: t("section5Description"),
    },
    {
      title: t("section6Title"),
      description: t("section6Description"),
    },
  ];

  return (
    <PolicyPageContent
      bannerTitle={t("bannerTitle")}
      bannerDescription={t("bannerDescription")}
      bannerImageSrc="/terms&Condition.png"
      bannerImageAlt={t("bannerImageAlt")}
      mainTitle={t("mainTitle")}
      mainDescription={t("mainDescription")}
      sections={sections}
    />
  );
}

