"use client"

import { createServer } from "@/features/servers/action/create-server"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export default function JobBatchingPage() {
  const { execute, isExecuting } = useAction(createServer, {
    onSuccess: () => {
      toast.success("Server created")
    },
    onError: () => {
      toast.error("Failed to create server")
    },
  })

  return (
    <main>
      <form action={execute}>
        <Button type="submit" loading={isExecuting}>
          Create Server
        </Button>
      </form>
    </main>
  )
}
