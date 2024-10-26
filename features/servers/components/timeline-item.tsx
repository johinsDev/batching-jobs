import { CheckIcon } from "lucide-react"

import { ServerTasksState } from "@/lib/db/schema"
import { cn } from "@/lib/utils"

const getStatusIcon = (status: ServerTasksState) => {
  switch (status) {
    case "pending":
      return (
        <span className="border-muted relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-white" />
      )
    case "inprogress":
      return (
        <span className="border-primary relative z-10 flex size-8 items-center justify-center rounded-full border-2 bg-white">
          <span className="bg-primary size-2.5 animate-pulse rounded-full" />
        </span>
      )
    case "completed":
      return (
        <span className="bg-primary relative z-10 flex size-8 items-center justify-center rounded-full">
          <CheckIcon className="size-5 text-white" />
        </span>
      )
    case "failed":
      return (
        <span className="relative z-10 flex size-8 items-center justify-center rounded-full border-2 border-black bg-white">
          <span className="size-2.5 rounded-full bg-black" />
        </span>
      )
    default:
      return null
  }
}

function getTitle(title: string, serverId: string) {
  switch (title) {
    case "create-server":
      return "Create server " + serverId
    case "install-nginx":
      return "Installing Nginx"
    case "finalize-server":
      return "Wrapping up"
    default:
      return ""
  }
}

function getDescription(title: string) {
  switch (title) {
    case "create-server":
      return "Creating your server"
    case "install-nginx":
      return "We are installing Nginx on your server"
    case "finalize-server":
      return "Adding finishing touches to your server"
    default:
      return ""
  }
}

type TimeLineItemProps = {
  title: string
  status: ServerTasksState
  serverId: string
}

export function TimeLineItem({ title, serverId, status }: TimeLineItemProps) {
  return (
    <li className="group relative pb-10">
      <div
        className={cn(
          "bg-muted absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 transition-colors group-last:hidden",
          {
            "bg-primary": status === "completed",
          }
        )}
      />
      <div className="group relative flex items-start">
        <span className="flex h-9 items-center">{getStatusIcon(status)}</span>
        <span className="ml-4 flex min-w-0 flex-col">
          <span className="text-sm font-medium">
            {getTitle(title, serverId)}
          </span>
          <span className="text-sm text-gray-500">{getDescription(title)}</span>
        </span>
      </div>
    </li>
  )
}
