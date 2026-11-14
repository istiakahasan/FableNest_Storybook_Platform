// import HomePageContent from "@/components/landingPages/homePage/HomePageContent";
// // import { useTranslations } from "next-intl";

// export default function Home() {
//   // const translate = useTranslations("HomePage");
//   return (
//     // <div>
//     //   <h1>{translate("title")}</h1>
//     // </div>

//     <HomePageContent />
//   );
// }




"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import HomePageContent from "@/components/landingPages/homePage/HomePageContent";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShouldRotate(true));
    
    // Cleanup function
    return () => {
      dispatch(setShouldRotate(false));
    };
  }, [dispatch]);

  return <HomePageContent />;
}