"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import logo from "@/public/zenith-logo.svg"
import zen from "@/public/zenith.svg"


import MainIcon from "@/components/sidebar-icons/main";
import ControlIcon from "@/components/sidebar-icons/control";
import DiplomaIcon from "@/components/sidebar-icons/diploma";
import DocumentIcon from "@/components/sidebar-icons/document";
import InspectIcon from "@/components/sidebar-icons/inspect";
import MedalIcon from "@/components/sidebar-icons/medal";
import ArchiveIcon from "@/components/sidebar-icons/archive";
import ClipboardIcon from "@/components/sidebar-icons/clipboard";
import StarIcon from "@/components/sidebar-icons/star";
import TornadoIcon from "@/components/sidebar-icons/tornado"
import UserHeartIcon from "@/components/sidebar-icons/userH";
import UserRoundedIcon from "@/components/sidebar-icons/userR";




import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronLeft,
  PanelLeft,
  PanelRight,
  UsersRound,
} from "lucide-react";
const menuItems = [
  {
    title: "الرئيسية",
    href: "",
    icon: MainIcon,
    subItems: [
      {
        title: "لوحة التحكم",
        href: "/",
        icon: ControlIcon,
      },
      {
        title: "الاضافات",
        href: "/adds",
        icon: ClipboardIcon,
      }
    ],
  },
  {
    title: "الموظفين",
    href: "/employees",
    icon: UserHeartIcon,
  },
  {
    title: "الطلاب",
    href: "/students",
    icon: UserRoundedIcon,
  },
  {
    title: "الدورات",
    href: "/courses",
    icon: DiplomaIcon,
  },
  // {
  //   title: "التقيم",
  //   href: "/evaluation",
  //   icon: StarIcon,
  // },
  {
    title: "النشاطات",
    href: "/activities",
    icon: MedalIcon,
  },
  {
    title: "الحوادث",
    href: "/accidents",
    icon: TornadoIcon,
  },
  {
    title: "المستخدمين",
    href: "/users",
    icon: UsersRound,
  }
  // {
  //   title: "تفتيش",
  //   href: "/inspection",
  //   icon: InspectIcon,
  // },
  // {
  //   title: "المشتريات",
  //   href: "/purchases",
  //   icon: DocumentIcon,
  // },
  // {
  //   title: "المخزن",
  //   href: "/warehouse",
  //   icon: ArchiveIcon,
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    // Hide "المستخدمين" (Users) menu for non-admin users
    if (item.title === "المستخدمين" && userRole === "User") {
      return false;
    }
    return true;
  });

  // Helper function to check if any subitem is active
  const isAnySubItemActive = (subItems: any[]) => {
    return subItems?.some(subItem => pathname === subItem.href) || false;
  };
  const [openCollapsibles, setOpenCollapsibles] = React.useState<
    Record<string, boolean>
  >({
    المستخدمين: false, // افتراضيًا مفتوح
  });

  const toggleCollapsible = (title: string) => {
    setOpenCollapsibles((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };


  return (
    <div
      className={cn(
        "sidebar-wrapper border-2 rounded-lg transition-all duration-300",
        state === "collapsed" ? "w-16 overflow-hidden" : "w-64"
      )}
      data-state={state}
    >
      <Sidebar side="right" className="border-none">
        <SidebarHeader className={cn(
          "flex items-center p-4 transition-all duration-300",
          state === "collapsed" ? "justify-center p-2  pb-[30px]" : "justify-between"
        )}>

          <div className={cn(
            "flex items-center gap-2 sidebar-header-text transition-all duration-300",
            state === "collapsed" && "hidden"
          )}>
            <Image
              alt="zenith logo"
              src={logo}
            />
            <div className=" pt-2">
              <Image
                alt="zenith text"
                src={zen}
              />
              <p className=" font-vazirmatn text-subtext font-medium text-[12px]">نظام إدارة المظلات</p>
            </div>
          </div>

          <SidebarTrigger className={cn(
            "transition-all duration-300",
            state === "collapsed" ? "relative" : ""
          )}>
            {state === "expanded" ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <PanelRight className="h-5 w-5" />
            )}
          </SidebarTrigger>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="">
            {filteredMenuItems.map((item) => (
              <React.Fragment key={item.title}>
                {item.subItems ? (
                  <Collapsible
                    open={state === "collapsed" ? false : openCollapsibles[item.title]}
                    onOpenChange={() => state !== "collapsed" && toggleCollapsible(item.title)}
                    className="w-full"
                  >
                    <SidebarMenuItem className={cn(
                      state === "collapsed" ? "w-full" : "w-[calc(100%-50px)]"
                    )}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full transition-all duration-300 flex items-center",
                            state === "collapsed" ? "justify-center px-2 py-3" : "justify-start"
                          )}
                          tooltip={state === "collapsed" ? item.title : undefined}
                          isActive={isAnySubItemActive(item.subItems)}
                        >
                          <div className={cn(
                            "flex items-center",
                            state === "collapsed" ? "justify-center" : "justify-start w-full"
                          )}>
                            <item.icon className={cn(
                              "h-6 w-6 flex-shrink-0",
                              isAnySubItemActive(item.subItems) ? "text-sidebaractive" : "text-[#979797]"
                            )} />
                            <span className={cn(
                              "sidebar-item-text mr-2 flex-1 rtl:mr-2 rtl:ml-0 font-normal text-base font-vazirmatn transition-all duration-300",
                              isAnySubItemActive(item.subItems) ? "!text-sidebaractive" : "text-[#979797]",
                              state === "collapsed" && "hidden"
                            )}>{item.title}</span>
                          </div>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    <CollapsibleContent>
                      <SidebarMenuSub className=" relative before:content-[''] before:absolute before:top-2 before:right-3 before:h-16 before:w-[2px] before:bg-sidebaractive before:rounded-lg">
                        {item.subItems.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href} >
                            <SidebarMenuSubButton asChild className="flex items-center">
                              <Link href={subItem.href} >
                                {/* <subItem.icon className="h-4 w-4" /> */}
                                <subItem.icon className={cn("h-4 w-4", pathname === subItem.href ? "text-sidebaractive" : "text-[#979797]")} />
                                <span className={cn("mr-2 rtl:mr-2 rtl:ml-0 font-normal text-base font-vazirmatn", pathname === subItem.href ? "!text-sidebaractive" : "text-[#979797]")}>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={state === "collapsed" ? item.title : undefined}
                      className={cn(
                        "transition-all duration-300 flex items-center",
                        state === "collapsed" ? "justify-center px-2 py-3" : "justify-start"
                      )}
                    >
                      <Link href={item.href || "#"} className="flex items-center w-full">
                        <div className={cn(
                          "flex items-center",
                          state === "collapsed" ? "justify-center" : "justify-start w-full"
                        )}>
                          <item.icon className={cn(
                            "h-6 w-6 flex-shrink-0",
                            pathname === item.href ? "text-sidebaractive" : "text-[#979797]"
                          )} />
                          <span className={cn(
                            "sidebar-item-text mr-2 rtl:mr-2 rtl:ml-0 text-[#979797] font-normal text-base font-vazirmatn transition-all duration-300",
                            pathname === item.href ? "!text-sidebaractive" : "",
                            state === "collapsed" && "hidden"
                          )}>{item.title}</span>
                        </div>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </React.Fragment>
            ))}
          </SidebarMenu>
        </SidebarContent>

      </Sidebar>
    </div>
  );
}
