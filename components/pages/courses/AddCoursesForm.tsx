"use client"
import React, { useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, ChevronsUpDown, Plus, X, Upload, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";

const addCoursesSchema = z.object({
    character: z.string().min(1, { message: "يجب إدخال الحرف" }),
    courseType: z.string().min(1, { message: "يجب إدخال نوع الدورة" }),
    startDate: z.string().min(1, { message: "يجب إدخال تاريخ بداية الدورة" }),
    endDate: z.string().min(1, { message: "يجب إدخال تاريخ نهاية الدورة" }),
    
})
