"use client" 
import React, { useRef, useState } from "react"
import { Control, Controller, FieldPath, FieldValues } from "react-hook-form"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import userRounded from "@/public/add-employe/UserRounded.svg"
import archive from "@/public/add-employe/ArchiveUp.svg"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface FileUploaderProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>
  name: TName
  title?: string
  description?: string
  buttonText?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  onFileChange?: (file: File | null) => void
}

export default function FileUploader<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  title = "الصورة الشخصية",
  description = "اختر صورة واضحة للموظف (png , jpg)",
  buttonText = "اختر صورة",
  accept = "image/*",
  maxSize = 5, // 5MB default
  className = "",
  disabled = false,
  onFileChange,
}: FileUploaderProps<TFieldValues, TName>) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileSelect = (onChange: (value: File | null) => void) => {
    const input = fileInputRef.current
    if (!input) return

    const file = input.files?.[0]
    if (!file) {
      onChange(null)
      setPreviewUrl(null)
      onFileChange?.(null)
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`حجم الملف يجب أن يكون أقل من ${maxSize} ميجابايت`)
      input.value = ""
      return
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح')
      input.value = ""
      return
    }

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    
    onChange(file)
    onFileChange?.(file)
  }

  const handleButtonClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div >
      <Card className={cn("max-w-[830px] pb-6", className)}>
        <CardHeader className="px-3 py-2 font-vazirmatn font-light text-subtext">
          {title}
        </CardHeader>
        <CardContent className="flex items-center gap-4 px-3">
          <Avatar className="size-24">
            {previewUrl ? (
              <AvatarImage src={previewUrl} alt="Preview" className="object-cover" />
            ) : (
              <AvatarImage src="" alt="@shadcn" />
            )}
            <AvatarFallback className="border border-sidebaractive bg-avatarClr">
              <Image src={userRounded} alt="userRounded" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div>
              <p className="font-vazirmatn font-light text-lg">
                رفع الصورة الشخصية
              </p>
              <p className="font-vazirmatn font-light text-sm text-subtext">
                {description}
              </p>
            </div>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange }, fieldState: { error } }) => (
                <div className="space-y-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    className="border border-sidebaractive"
                    onClick={handleButtonClick}
                    disabled={disabled}
                  >
                    <Image src={archive} alt="archive" className="size-6"/>
                    {buttonText}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={() => handleFileSelect(onChange)}
                    className="hidden"
                    disabled={disabled}
                  />
                  {error && (
                    <p className="text-sm text-red-500 font-vazirmatn">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}