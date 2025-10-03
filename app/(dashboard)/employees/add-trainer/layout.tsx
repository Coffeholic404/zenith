import { Toaster } from "@/components/ui/toaster"

export default function AddTrainerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
