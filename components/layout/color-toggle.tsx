"use client"

import { useEffect, useState } from "react"
import { Check, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type ColorTheme = "blue" | "yellow" | "green" | "purple"

export function ColorToggle() {
  const [theme, setTheme] = useState<ColorTheme>("blue")

  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") as ColorTheme
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.remove("theme-blue", "theme-yellow", "theme-green", "theme-purple")
      document.documentElement.classList.add(`theme-${savedTheme}`)
    }
  }, [])

  const setColorTheme = (newTheme: ColorTheme) => {
    document.documentElement.classList.remove("theme-blue", "theme-yellow", "theme-green", "theme-purple")
    document.documentElement.classList.add(`theme-${newTheme}`)
    localStorage.setItem("color-theme", newTheme)
    setTheme(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" title="تغيير لون السمة">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">تغيير لون السمة</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setColorTheme("blue")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-blue-600" />
            <span>أزرق</span>
          </div>
          {theme === "blue" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorTheme("yellow")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-yellow-400" />
            <span>أصفر</span>
          </div>
          {theme === "yellow" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorTheme("green")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-500" />
            <span>أخضر</span>
          </div>
          {theme === "green" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorTheme("purple")} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-purple-600" />
            <span>بنفسجي</span>
          </div>
          {theme === "purple" && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

