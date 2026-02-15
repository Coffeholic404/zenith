import { cn } from '@/lib/utils';

// Helper function to apply RTL-specific classes
export function rtlClass(className: string, rtlClassName: string): string {
  return cn(className, 'rtl:dir-rtl', rtlClassName);
}

// Helper function to flip margins/paddings for RTL
export function flipForRTL(value: string): string {
  return value
    .replace(/mr-/g, 'temp-')
    .replace(/ml-/g, 'mr-')
    .replace(/temp-/g, 'ml-')
    .replace(/pr-/g, 'temp-')
    .replace(/pl-/g, 'pr-')
    .replace(/temp-/g, 'pl-')
    .replace(/right-/g, 'temp-')
    .replace(/left-/g, 'right-')
    .replace(/temp-/g, 'left-');
}

// Helper to apply RTL-aware spacing
export function rtlSpacing(className: string): string {
  return cn(className, flipForRTL(className));
}
