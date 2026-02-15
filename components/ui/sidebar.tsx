'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

interface SidebarContextValue {
  state: 'expanded' | 'collapsed';
  setState: React.Dispatch<React.SetStateAction<'expanded' | 'collapsed'>>;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextValue>({
  state: 'expanded',
  setState: () => {},
  toggleSidebar: () => {}
});

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export function SidebarProvider({
  children,
  defaultState = 'expanded'
}: {
  children: React.ReactNode;
  defaultState?: 'expanded' | 'collapsed';
}) {
  const [state, setState] = React.useState<'expanded' | 'collapsed'>(defaultState);

  const toggleSidebar = React.useCallback(() => {
    setState(prev => (prev === 'expanded' ? 'collapsed' : 'expanded'));
  }, []);

  return <SidebarContext.Provider value={{ state, setState, toggleSidebar }}>{children}</SidebarContext.Provider>;
}

const sidebarVariants = cva(
  'group/sidebar relative flex h-full flex-col overflow-hidden bg-background transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'border-r',
        inset: ''
      },
      side: {
        left: '',
        right: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      side: 'left'
    }
  }
);

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof sidebarVariants> {
  collapsible?: boolean | 'icon';
}

export function Sidebar({ className, variant, side, collapsible, ...props }: SidebarProps) {
  const { state } = useSidebar();

  return (
    <div
      data-state={state}
      data-side={side}
      data-collapsible={collapsible}
      className={cn(sidebarVariants({ variant, side }), className)}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-b', className)} {...props} />;
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-auto', className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border-t', className)} {...props} />;
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2 p-2', className)} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
  asChild?: boolean;
}

export function SidebarMenuButton({ className, isActive, tooltip, asChild = false, ...props }: SidebarMenuButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-active={isActive}
      title={tooltip}
      className={cn(
        'group/menu-button flex w-[calc(100%-50px)] items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent/50 rtl:text-right',
        className
      )}
      {...props}
    />
  );
}

export function SidebarMenuSub({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col gap-1 pr-4 pt-1 group-data-[state=collapsed]/sidebar:hidden', className)}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('', className)} {...props} />;
}

export interface SidebarMenuSubButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  asChild?: boolean;
}

export function SidebarMenuSubButton({ className, isActive, asChild = false, ...props }: SidebarMenuSubButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-active={isActive}
      className={cn(
        'group/menu-sub-button subsidebar flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ',
        className
      )}
      {...props}
    />
  );
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export function SidebarRail({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'absolute inset-y-0 left-0 w-1 bg-accent/50 transition-all duration-300 ease-in-out group-data-[state=collapsed]/sidebar:opacity-0',
        className
      )}
      {...props}
    />
  );
}

export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { state } = useSidebar();

  return (
    <div
      data-state={state}
      className={cn('flex-1 transition-[margin] duration-300 ease-in-out', className)}
      {...props}
    />
  );
}
