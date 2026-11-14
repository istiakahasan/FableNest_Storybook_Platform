"use client";

import Link from "next/link";
import { usePathname, useSelectedLayoutSegment } from "next/navigation";

const tabs = [
  {
    name: "Admin",
    href: "/dashboard/settings",
    segment: null,
  },
  {
    name: "Suspended",
    href: "/dashboard/settings/suspended-users",
    segment: "suspended-users",
  },
  {
    name: "Management",
    href: "/dashboard/settings/admin-management",
    segment: "admin-management",
  },
];

const RouteTabs = () => {
  const pathname = usePathname();
  const segment = useSelectedLayoutSegment();

  const isTabActive = (tab: (typeof tabs)[0]) => {
    if (tab.segment === null) {
      return pathname === "/dashboard/settings" || segment === null;
    }
    return segment === tab.segment;
  };

  return (
    <div className="w-full">
      <div className="flex justify-start">
        <div className="overflow-x-auto scrollbar-hide">
          <nav
            className="inline-flex space-x-4 py-1"
            aria-label="Settings tabs">
            {tabs.map((tab) => {
              const active = isTabActive(tab);

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`
                    relative inline-flex items-center justify-center 
                    px-6 py-3 text-xs sm:text-lg font-medium
                    transition-all duration-200 ease-out whitespace-nowrap
                    rounded-lg w-fit 
                    ${
                      active
                        ? "text-white bg-[#73B7FF]"
                        : "text-gray-700 hover:text-[#73B7FF] hover:bg-gray-50 bg-white shadow-xs"
                    }
                  `}
                  aria-current={active ? "page" : undefined}>
                  <span className="truncate">{tab.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default RouteTabs;
