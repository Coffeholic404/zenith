"use client"

import * as React from "react"
import { UploadCloud, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  value: string[]
  onChange: (value: string[]) => void
  multiple?: boolean
}

export function FileUploader({ value = [], onChange, multiple = false }: FileUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  // في بيئة الإنتاج، ستحتاج إلى تنفيذ رفع الملفات الفعلي إلى خدمة تخزين
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return

    // محاكاة رفع الملفات - في الإنتاج، ستستخدم API لرفع الملفات
    const newUrls = Array.from(files).map((file) => {
      // إنشاء URL مؤقت للملف
      return URL.createObjectURL(file)
    })

    if (multiple) {
      onChange([...value, ...newUrls])
    } else {
      onChange(newUrls.slice(0, 1))
    }

    // إعادة تعيين حقل الإدخال
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const removeFile = (url: string) => {
    onChange(value.filter((item) => item !== url))
  }

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">اسحب وأفلت الملفات هنا أو انقر للتصفح</p>
        <p className="text-xs text-muted-foreground">
          {multiple ? "يمكنك رفع ملفات متعددة" : "يمكنك رفع ملف واحد فقط"}
        </p>
        <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} multiple={multiple} />
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          {value.map((url, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-muted rounded flex items-center justify-center mr-2">
                  <span className="text-xs">{url.split(".").pop()?.toUpperCase()}</span>
                </div>
                <div className="text-sm truncate max-w-[200px]">{url.split("/").pop()}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(url)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

