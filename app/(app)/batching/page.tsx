"use client"

import { createServer } from "@/features/servers/action/create-server"
import { useAction } from "next-safe-action/hooks"

import { Button } from "@/components/ui/button"

export default function JobBatchingPage() {
  const { execute } = useAction(createServer)

  return (
    <main>
      <form action={execute}>
        <Button type="submit">Create Server</Button>
      </form>
    </main>
  )
}
