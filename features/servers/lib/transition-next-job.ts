import { getNextServerTask } from "@/features/servers/data-access/server-tasks"
import { serverTypeFactory } from "@/features/servers/lib/server-type-factory"

import { NewServer } from "@/lib/db/schema"

type TransitionNextJobParams = {
  batchId: string
  server: NewServer
}

export async function transitionNextJob({
  batchId,
  server,
}: TransitionNextJobParams) {
  const jobs = serverTypeFactory[server.type ?? "web"]

  const nextServerTask = await getNextServerTask(server.id)

  if (nextServerTask) {
    console.log("Transitioning task to inprogress", { nextServerTask })

    const job = jobs[nextServerTask.order - 1]

    console.info("Get next task to run", { job, task: job.task })

    await job.task.trigger({
      server,
      batchId,
    })
  } else {
    console.info("No pending task found", { serverId: server.id })
  }
}
