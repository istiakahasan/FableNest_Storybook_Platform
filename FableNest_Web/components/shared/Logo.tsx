/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Logo({ className, logoImage }: { className?: string, logoImage: any }) {
  return (
    <Link href="/">
      <Image className={cn(className)} src={logoImage} alt="logo" />
    </Link>
  );
}
