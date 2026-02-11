'use client'

import * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'
import { cn } from '@/lib/utils'

interface BottomSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  className?: string
  overlayClassName?: string
  showHandle?: boolean
  modal?: boolean
}

export function BottomSheet({
  open,
  onOpenChange,
  children,
  className,
  overlayClassName,
  showHandle = true,
  modal = true,
}: BottomSheetProps) {
  return (
    <DrawerPrimitive.Root
      open={open}
      onOpenChange={onOpenChange}
      direction="bottom"
      modal={modal}
    >
      <DrawerPrimitive.Portal>
        <DrawerPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/50',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            overlayClassName
          )}
        />
        <DrawerPrimitive.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[24px]',
            className
          )}
        >
          {showHandle && (
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            </div>
          )}
          <DrawerPrimitive.Title className="sr-only">Bottom Sheet</DrawerPrimitive.Title>
          {children}
        </DrawerPrimitive.Content>
      </DrawerPrimitive.Portal>
    </DrawerPrimitive.Root>
  )
}
