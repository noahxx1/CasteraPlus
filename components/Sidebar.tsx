"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <section className="sticky left-0 top-0 w-fit h-screen max-sm:hidden flex-between flex-col pt-28 p-6 lg:w-[264px] bg-black-200">
      <div className="flex flex-col w-full gap-6 ">
        {sidebarLinks.map((item, index) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`${item.route}/`);
          return (
            <Link
              href={item.route}
              key={index}
              className={cn(
                "flex justify-start items-center gap-4 p-4 rounded-lg",
                {
                  "bg-primary": isActive,
                }
              )}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={24}
                height={24}
              />
              <p className="text-lg max-md:hidden">{item.label}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Sidebar;
