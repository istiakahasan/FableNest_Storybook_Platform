"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Bell } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import toast from "react-hot-toast";

const UserSettings = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // Store current route before logging out
    if (typeof window !== "undefined") {
      // Only store if it's not an auth page
      if (pathname && !pathname.includes("/auth/")) {
        sessionStorage.setItem("logoutReferrer", pathname);
      } else {
        // If on auth page, use home as default
        sessionStorage.setItem("logoutReferrer", "/");
      }
      
      // Clear access token (keep rememberedEmail for Remember Me functionality)
      localStorage.removeItem("accessToken");
    }
    toast.success("Logged out successfully!");
    // Redirect to login page
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="h-10 w-10 rounded-full overflow-hidden shadow">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback className="rounded-md">JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer">
          <Bell className="mr-2 h-4 w-4" />
          <span>Notifications</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="cursor-pointer text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSettings;
