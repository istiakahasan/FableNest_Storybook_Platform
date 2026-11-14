"use client";

import TrackOrderContent from "@/components/landingPages/myOrder/TrackOrderContent";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function TrackOrderPage() {
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
      <TrackOrderContent />
    </div>
  );
}

