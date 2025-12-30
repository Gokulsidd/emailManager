"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg px-0.75",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Trigger
  data-slot="tabs-trigger"
  className={cn(
    `
    relative cursor-pointer
    inline-flex flex-1 items-center justify-center gap-2
    whitespace-nowrap px-4 py-1.5 text-sm font-medium
    text-muted-foreground
    transition-all duration-200 ease-in-out

    hover:text-foreground
    rounded-xl

    data-[state=active]:text-blue-500
    data-[state=active]:after:absolute
    data-[state=active]:after:inset-x-0
    data-[state=active]:after:-bottom-[3px]
    data-[state=active]:after:h-[2px]
    data-[state=active]:bg-blue-100
    data-[state=active]:shadow-xs

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2

    disabled:pointer-events-none
    disabled:opacity-50

    [&_svg]:pointer-events-none
    [&_svg]:size-4
    [&_svg]:shrink-0
    `,
    className
  )}
  {...props}
/>

  )
}

function TabsContent({
  className,
  ...props
}) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

