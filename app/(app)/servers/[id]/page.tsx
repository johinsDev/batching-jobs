import { notFound } from "next/navigation"
import { DestroyServerForm } from "@/features/servers/components/destroy-server-form"
import { TimeLineItem } from "@/features/servers/components/timeline-item"
import { getServer } from "@/features/servers/data-access/server"

type ServerPageProps = {
  params: Promise<{ id: string }>
}

export default async function ServerPage(props: ServerPageProps) {
  const params = await props.params

  const server = await getServer(params.id)

  if (!server) {
    return notFound()
  }

  const isProvisioned = server.provisionedAt !== null

  return (
    <main>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {isProvisioned && (
            <div className="rounded-lg bg-gray-200 p-12 text-center">
              Server {server.id}
            </div>
          )}

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
      </div>
    </main>
  )
}
