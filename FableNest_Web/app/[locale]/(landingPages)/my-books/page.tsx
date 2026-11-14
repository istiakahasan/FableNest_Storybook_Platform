"use client";

import MyBooksContent from "@/components/landingPages/myBooks/MyBooksContent";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function MyBooksPage() {
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
      <div className="mt-20 sm:mt-28 md:mt-32 lg:mt-[156px]">
        <MyBooksContent />
      </div>
    </div>
  );
}

