"use client";

import ContactContent from "@/components/landingPages/contact/ContactContent";
import { useAppDispatch } from "@/store/hooks";
import { setShouldRotate } from "@/store/slices/backgroundSlice";
import { useEffect } from "react";

export default function ContactPage() {
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
      <ContactContent />
    </div>
  );
}

