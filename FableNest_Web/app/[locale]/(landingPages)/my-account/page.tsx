"use client";

import MyAccountContent from "@/components/landingPages/myAccount/MyAccountContent";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function MyAccountPage() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setShouldRotate(true));

    // Cleanup function
    return () => {
      dispatch(setShouldRotate(false));
    };
  }, [dispatch]);

  return (
    <div>
      <MyAccountContent />
    </div>
  );
}

