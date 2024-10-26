"use client"

import { destroyServer } from "@/features/servers/action/destroy-server"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DestroyServerFormProps = {
  batchId: string | null
}

export function DestroyServerForm(props: DestroyServerFormProps) {
  const { execute, isExecuting } = useAction(destroyServer, {
    onSuccess: () => {
      toast.success("Server destroyed")
    },
    onError: () => {
      toast.error("Failed to destroy server")
    },
  })

  if (!props.batchId) {
    return null
  }

  return (
    <form action={execute}>
      <div className="mb-6">
        <Input name="batchId" type="hidden" value={props.batchId} readOnly />
        <Button variant={"destructive"} loading={isExecuting}>
          Destroy server
        </Button>
      </div>
    </form>
  )
}
