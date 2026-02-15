'use client';

import * as React from 'react';
import { Moon, Sun, Palette } from 'lucide-react';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ColorTheme = 'blue' | 'yellow' | 'green' | 'purple';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [colorTheme, setColorTheme] = React.useState<ColorTheme>('blue');
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme') as ColorTheme;
    if (savedTheme) {
      setColorTheme(savedTheme);
      document.documentElement.classList.remove('theme-blue', 'theme-yellow', 'theme-green', 'theme-purple');
      document.documentElement.classList.add(`theme-${savedTheme}`);
    }
  }, []);

  const setColorMode = (newTheme: ColorTheme) => {
    document.documentElement.classList.remove('theme-blue', 'theme-yellow', 'theme-green', 'theme-purple');
    document.documentElement.classList.add(`theme-${newTheme}`);
    localStorage.setItem('color-theme', newTheme);
    setColorTheme(newTheme);
  };

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">تبديل السمة</span>
                {/* <div
                  className={cn(
                    "absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background",
                    colorTheme === "blue" && "bg-blue-600 dark:bg-blue-500",
                    colorTheme === "yellow" && "bg-yellow-400",
                    colorTheme === "green" && "bg-green-500",
                    colorTheme === "purple" && "bg-purple-600",
                  )}
                /> */}
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>تغيير السمة واللون</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-56">
          <div className="grid grid-cols-2 gap-2 p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme('light')}
              className={cn('justify-start', theme === 'light' && 'bg-accent')}
            >
              <Sun className="ml-2 h-4 w-4" />
              فاتح
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme('dark')}
              className={cn('justify-start', theme === 'dark' && 'bg-accent')}
            >
              <Moon className="ml-2 h-4 w-4" />
              داكن
            </Button>
          </div>
          <div className="p-2 pt-0">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className={cn('h-8 border-2 justify-center items-center', colorTheme === 'blue' && 'border-blue-600')}
                onClick={() => setColorMode('blue')}
              >
                <div className="h-4 w-4 rounded-full bg-blue-600" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 border-2 justify-center items-center',
                  colorTheme === 'yellow' && 'border-yellow-400'
                )}
                onClick={() => setColorMode('yellow')}
              >
                <div className="h-4 w-4 rounded-full bg-yellow-400" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn('h-8 border-2 justify-center items-center', colorTheme === 'green' && 'border-green-500')}
                onClick={() => setColorMode('green')}
              >
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-8 border-2 justify-center items-center',
                  colorTheme === 'purple' && 'border-purple-600'
                )}
                onClick={() => setColorMode('purple')}
              >
                <div className="h-4 w-4 rounded-full bg-purple-600" />
              </Button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
}
