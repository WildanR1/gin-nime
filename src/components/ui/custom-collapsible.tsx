"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CustomCollapsible = CollapsiblePrimitive.Root;

const CustomCollapsibleTrigger = React.forwardRef<
  React.ElementRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger> & {
    children?: React.ReactNode;
  }
>(({ className, children, ...props }, ref) => (
  <CollapsiblePrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full items-center justify-between transition-all duration-200 [&[data-state=open]>svg]:rotate-180",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 transition-transform duration-200" />
  </CollapsiblePrimitive.Trigger>
));
CustomCollapsibleTrigger.displayName = "CustomCollapsibleTrigger";

const CustomCollapsibleContent = CollapsiblePrimitive.Content;

export { CustomCollapsible, CustomCollapsibleTrigger, CustomCollapsibleContent };
