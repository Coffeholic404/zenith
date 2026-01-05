"use client";

import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp, CircleAlert  } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { signOut } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export function AppHeader() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <header className="sticky top-0 z-10 flex h-[68px]  items-center gap-4 bg-transparent px-6">
      <div className="md:hidden">
        <SidebarTrigger className="hover:bg-primary/10 transition-colors" />
      </div>
      <div className="w-full flex items-center justify-between gap-4 shrink-1">
        {/* <div className="relative ">
          <input
            type="search"
            placeholder="بحث..."
            className="h-11 lg:w-[441px] rounded-full bg-searchBg px-4 text-sm border border-searchBg focus:border-searchBg focus:outline-none focus:ring-1 focus:ring-blue-300 "
          />
        </div> */}
        <div className="w-full flex items-center justify-end gap-4">
          {/* <ThemeToggle /> */}
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative hover:bg-primary/10 transition-colors"
          >
            <CircleAlert className="h-5 w-5 text-userWelcomClr" />
            {/* <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span> */}
            <span className="sr-only">الإشعارات</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative hover:bg-primary/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-userWelcomClr" />
            {/* <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span> */}
            <span className="sr-only">الإشعارات</span>
          </Button>
          <div className="flex items-center gap-1">
            <DropdownMenu onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <div className=" flex gap-4">
                  <div className=" text-left cursor-pointer">
                    <p className="font-normal text-xs  text-userWelcomClr">
                      welcom
                    </p>
                    <p className=" text-xs font-medium text-userEmailClr  flex flex-row-reverse">
                      {isDropdownOpen ? <ChevronUp className="h-4 w-4 text-userWelcomClr " /> : <ChevronDown className="h-4 w-4 text-userWelcomClr " />}someone@gmail.com
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 transition-colors"
                  >
                    <Avatar className=" size-12">
                      <AvatarImage src="placeholder.svg" alt="صورة المستخدم" />
                      <AvatarFallback>م</AvatarFallback>
                    </Avatar>
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">أحمد محمد</p>
                    <p className="text-xs text-muted-foreground">
                      ahmed@example.com
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="ml-2 h-4 w-4" />
                  <span>الملف الشخصي</span>
                </DropdownMenuItem>
                <DropdownMenuItem>الإعدادات</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      // await logout().unwrap();
                      signOut({
                        redirect: false,
                      });
                    } catch (error) {}
                  }}
                >
                  تسجيل الخروج
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
