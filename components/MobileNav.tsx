"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src="/icons/hamburger.svg"
            alt="menu"
            width={36}
            height={36}
            className="cursor-pointer sm:hidden"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-black-200">
          <Link href="/">
            <div className="flex items-center gap-1 ">
              <Image
                src="/icons/logo.svg"
                alt="logo"
                width={180}
                height={32}
                className="max-sm:size-50"
              />
            </div>
          </Link>
          <div className="flex h-[calc(100vh-72px)] flex-col overflow-y-auto">
            <SheetClose asChild>
              <section className="h-full flex flex-col gap-6 pt-16 text-white">
                {sidebarLinks.map((item, index) => {
                  const isActive =
                    pathname === item.route ||
                    pathname.startsWith(`${item.route}/`);
                  return (
                    <SheetClose key={index} asChild>
                      <Link
                        href={item.route}
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
                        <p className="text-lg">{item.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
