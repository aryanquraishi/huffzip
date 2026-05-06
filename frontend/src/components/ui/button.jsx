import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#005f6a] text-white hover:bg-[#004f57]",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-[#005f6a] text-[#005f6a] bg-transparent hover:bg-[#ebe8e4] dark:border-teal-400 dark:text-teal-400 dark:hover:bg-[#2a2a2a]",
        secondary: "bg-[#ebe8e4] text-[#1c1c19] hover:bg-[#bdc8cb]/30 dark:bg-[#2a2a2a] dark:text-white dark:hover:bg-[#3a3a3a]",
        ghost: "hover:bg-[#ebe8e4] dark:hover:bg-[#2a2a2a]",
        link: "text-[#005f6a] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
