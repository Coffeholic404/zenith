"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

// بيانات تجريبية للمستخدمين
const users = [
  {
    id: "1",
    name: "جايفيون سيمون",
    title: "الرئيس التنفيذي",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "9.91k",
    following: "1.95k",
    totalPost: "9.12k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: "2",
    name: "لوسيان أوبراين",
    title: "مدير تقني",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "1.95k",
    following: "9.12k",
    totalPost: "6.98k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: "3",
    name: "ديجا برادي",
    title: "منسق مشاريع",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "9.12k",
    following: "6.98k",
    totalPost: "8.49k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: "4",
    name: "هاريسون ستاين",
    title: "قائد فريق",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "6.98k",
    following: "8.49k",
    totalPost: "2.03k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: "5",
    name: "ريس تشونغ",
    title: "مطور برمجيات",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "8.49k",
    following: "2.03k",
    totalPost: "3.36k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
  {
    id: "6",
    name: "ليني ديفيدسون",
    title: "استراتيجي تسويق",
    avatar: "/images/avatar.webp",
    coverImage: "/images/cover.webp",
    follower: "2.03k",
    following: "3.36k",
    totalPost: "8.4k",
    social: {
      facebook: "#",
      instagram: "#",
      linkedin: "#",
      twitter: "#",
    },
  },
];

export function UserCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <Card key={user.id} className="overflow-hidden border-0 shadow-md">
          {/* Cover Image */}
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={user.coverImage}
              alt="Cover"
              fill
              className="object-cover"
            />
            {/* Cutout for Avatar */}
          </div>

          {/* Content */}
          <CardContent className="pt-12 pb-6 text-center relative">
            {/* Avatar */}
            {/* <div className="absolute left-1/2 top-32 -translate-x-1/2">
              <Avatar className="h-20 w-20 border-4 border-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div> */}
            <div className="absolute -top-10 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full border-4 flex items-center justify-center z-[3]">
              <Avatar className="h-20 w-20 z-10 border-4 border-background">
                <AvatarImage
                  className="text-xl z-10"
                  src={user.avatar}
                  alt={user.name}
                />
                <AvatarFallback className="text-xl">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            {/* User Info */}
            <div className="mb-4">
              <h3 className="text-xl font-bold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.title}</p>
            </div>

            {/* Social Icons */}
            <div className="mb-6 flex justify-center space-x-3">
              <Link
                href={user.social.facebook}
                className="text-muted-foreground hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={user.social.instagram}
                className="text-muted-foreground hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={user.social.linkedin}
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href={user.social.twitter}
                className="text-muted-foreground hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x rtl:divide-x-reverse border-t pt-4">
              <div className="px-2 text-center">
                <div className="text-xs text-muted-foreground">متابع</div>
                <div className="font-medium">{user.follower}</div>
              </div>
              <div className="px-2 text-center">
                <div className="text-xs text-muted-foreground">يتابع</div>
                <div className="font-medium">{user.following}</div>
              </div>
              <div className="px-2 text-center">
                <div className="text-xs text-muted-foreground">منشورات</div>
                <div className="font-medium">{user.totalPost}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
