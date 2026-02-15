'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Briefcase, GraduationCap, MoreVertical, Edit, Share2 } from 'lucide-react';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function UserProfile() {
  const [activeTab, setActiveTab] = React.useState('profile');

  const userData = {
    name: 'أحمد محمد',
    title: 'مدير تقني',
    avatar: '/images/avatar.webp',
    coverImage: '/images/cover.webp',
    followers: '1,947',
    following: '9,124',
    about:
      'مطور ويب متخصص في تطوير تطبيقات الويب باستخدام React و Next.js. أعمل في مجال البرمجة منذ أكثر من 5 سنوات وأسعى دائمًا لتطوير مهاراتي وتعلم التقنيات الجديدة.',
    location: 'الرياض، المملكة العربية السعودية',
    email: 'ahmed@example.com',
    company: 'شركة التقنية المتقدمة',
    education: 'جامعة الملك سعود - علوم الحاسب',
    social: {
      facebook: 'https://www.facebook.com/ahmed',
      instagram: 'https://www.instagram.com/ahmed',
      linkedin: 'https://www.linkedin.com/in/ahmed',
      twitter: 'https://www.twitter.com/ahmed'
    },
    posts: [
      {
        id: 1,
        date: '22 مارس 2023',
        content: 'غروب الشمس ببطء فوق الأفق، ملونًا السماء بألوان زاهية من البرتقالي والوردي.',
        image: '/placeholder.svg?height=400&width=600&text=Sunset'
      },
      {
        id: 2,
        date: '15 فبراير 2023',
        content: 'اليوم أكملت مشروعًا جديدًا باستخدام Next.js وTailwind CSS. كانت تجربة رائعة!',
        image: null
      }
    ]
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Cover Image and Profile */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="h-64 w-full relative">
          <Image src={userData.coverImage || '/placeholder.svg'} alt="Cover" fill className="object-cover" priority />
        </div>

        <div className="absolute bottom-0 right-0 left-0 bg-gradient-to-t from-black/60 to-transparent h-1/2"></div>

        <div className="absolute bottom-4 right-8 flex items-end">
          <Avatar className="h-24 w-24 border-4 border-background">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback className="text-2xl">{userData.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="mr-4 mb-2 text-white">
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <p className="text-sm opacity-90">{userData.title}</p>
          </div>
        </div>

        <div className="absolute left-4 bottom-4">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30 hover:text-white"
          >
            <Edit className="h-4 w-4 ml-2" />
            تعديل الملف
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6 border-b">
        <div className="flex justify-between items-center">
          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="bg-transparent h-12 p-0 w-full justify-start">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 h-12"
              >
                الملف الشخصي
              </TabsTrigger>
              <TabsTrigger
                value="followers"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 h-12"
              >
                المتابعون
              </TabsTrigger>
              <TabsTrigger
                value="friends"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 h-12"
              >
                الأصدقاء
              </TabsTrigger>
              <TabsTrigger
                value="gallery"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-4 h-12"
              >
                معرض الصور
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="ghost" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">{userData.followers}</div>
              <div className="text-sm text-muted-foreground">متابع</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userData.following}</div>
              <div className="text-sm text-muted-foreground">يتابع</div>
            </div>
          </div>

          {/* About */}
          <div className="border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">نبذة عني</h2>
            <p className="text-sm text-muted-foreground mb-4">{userData.about}</p>

            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 ml-2 text-primary" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 ml-2 text-primary" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 ml-2 text-primary" />
                <span>{userData.company}</span>
              </div>
              <div className="flex items-center text-sm">
                <GraduationCap className="h-4 w-4 ml-2 text-primary" />
                <span>{userData.education}</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="border rounded-lg p-4">
            <h2 className="font-bold text-lg mb-3">التواصل الاجتماعي</h2>
            <div className="space-y-3">
              <Link href={userData.social.facebook} className="flex items-center text-sm hover:text-primary">
                <Facebook className="h-4 w-4 ml-2 text-primary" />
                <span>فيسبوك</span>
              </Link>
              <Link href={userData.social.instagram} className="flex items-center text-sm hover:text-primary">
                <Instagram className="h-4 w-4 ml-2 text-primary" />
                <span>انستغرام</span>
              </Link>
              <Link href={userData.social.linkedin} className="flex items-center text-sm hover:text-primary">
                <Linkedin className="h-4 w-4 ml-2 text-primary" />
                <span>لينكد إن</span>
              </Link>
              <Link href={userData.social.twitter} className="flex items-center text-sm hover:text-primary">
                <Twitter className="h-4 w-4 ml-2 text-primary" />
                <span>تويتر</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Post Form */}
          <div className="border rounded-lg p-4">
            <Textarea placeholder="شارك ما يدور في ذهنك..." className="resize-none mb-4" rows={3} />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 space-x-reverse rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  صورة/فيديو
                </Button>
                <Button variant="outline" size="sm">
                  بث مباشر
                </Button>
              </div>
              <Button>نشر</Button>
            </div>
          </div>

          {/* Posts */}
          {userData.posts.map(post => (
            <div key={post.id} className="border rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={userData.avatar} alt={userData.name} />
                      <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="mr-3">
                      <div className="font-medium">{userData.name}</div>
                      <div className="text-xs text-muted-foreground">{post.date}</div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>تعديل</DropdownMenuItem>
                      <DropdownMenuItem>حذف</DropdownMenuItem>
                      <DropdownMenuItem>إبلاغ</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm mb-4">{post.content}</p>
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-2">
                    <Image
                      src={post.image || '/placeholder.svg'}
                      alt="Post"
                      width={600}
                      height={400}
                      className="w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="bg-muted/20 p-3 flex justify-between border-t">
                <Button variant="ghost" size="sm">
                  إعجاب
                </Button>
                <Button variant="ghost" size="sm">
                  تعليق
                </Button>
                <Button variant="ghost" size="sm">
                  مشاركة
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
