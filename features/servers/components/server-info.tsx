"use client"

import { useEffect } from "react"
import { notFound, useParams } from "next/navigation"
import { TimeLineItem } from "@/features/servers/components/timeline-item"
import { useQuery } from "@tanstack/react-query"

import { formatServerDateTime } from "@/lib/date"
import { Server, ServerTasks } from "@/lib/db/schema"

import { DestroyServerForm } from "./destroy-server-form"
import ServerInfoSkeleton from "./server-info-skeleton"

type ServerWithTasks = Server & { tasks: Array<ServerTasks> }

export function ServerInfo() {
  const params = useParams()

  const serverId = params.id

  const {
    data: server,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["server", serverId],
    queryFn: async () => {
      const res = await fetch(`/api/servers/${serverId}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const json = (await res.json()) as { data: ServerWithTasks }

      return json.data
    },
    refetchInterval(query) {
      // if server return 404, stop polling
      if (query.state.fetchFailureCount > 2) {
        return false
      }

      if (query.state.data?.provisionedAt) {
        return false
      }

      return 1000
    },
  })

  useEffect(() => {
    if (error && !isLoading && !server) {
      notFound()
    }
  }, [error, server, isLoading])

  const isProvisioned = server?.provisionedAt !== null

  if (!server || isLoading) {
    return <ServerInfoSkeleton />
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="bg-muted mb-6 flex h-32 items-center justify-center rounded-lg text-left">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900">Server</span>
            <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-600">
              {serverId}
            </code>
          </div>
          <div className="text-sm lowercase text-gray-600 first-letter:capitalize">
            Provisioned at{" "}
            <span className="text-primary/70">
              {formatServerDateTime(server.provisionedAt)}
            </span>
          </div>
        </div>
      </div>

      {!isProvisioned && (
        <>
          <DestroyServerForm batchId={server.batchId} />

          <ul>
            {server.tasks.map((task) => (
              <TimeLineItem
                key={task.id}
                title={task.name}
                serverId={server.id}
                status={task.state}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
