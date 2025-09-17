import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  currentStep: number
  children: React.ReactNode
  className?: string
}

export function Steps({ currentStep, children, className }: StepsProps) {
  const childrenArray = React.Children.toArray(children)
  const steps = childrenArray.map((step, index) => {
    return React.cloneElement(step as React.ReactElement, {
      isActive: currentStep === index,
      isCompleted: currentStep > index,
      position: index + 1,
    })
  })

  return <div className={cn("flex w-full justify-between", className)}>{steps}</div>
}

interface StepProps {
  title: string
  isActive?: boolean
  isCompleted?: boolean
  position?: number
  className?: string
}

export function Step({ title, isActive, isCompleted, position, className }: StepProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="flex items-center">
        {position !== 1 && <div className={cn("h-1 w-10 md:w-20 lg:w-32", isCompleted ? "bg-primary" : "bg-muted")} />}
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold",
            isActive && "border-primary bg-primary text-primary-foreground",
            isCompleted && "border-primary bg-primary text-primary-foreground",
            !isActive && !isCompleted && "border-muted bg-background",
          )}
        >
          {isCompleted ? "✓" : position}
        </div>
        {position !== 4 && <div className={cn("h-1 w-10 md:w-20 lg:w-32", isCompleted ? "bg-primary" : "bg-muted")} />}
      </div>
      <span
        className={cn(
          "mt-2 text-xs font-medium",
          (isActive || isCompleted) && "text-foreground",
          !isActive && !isCompleted && "text-muted-foreground",
        )}
      >
        {title}
      </span>
    </div>
  )
}

