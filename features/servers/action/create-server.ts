"use server"

import { createServer as createServerDb } from "@/features/servers/data-access/server"
import { createServerTasks } from "@/features/servers/data-access/server-tasks"
import { serverTypeFactory } from "@/features/servers/lib/server-type-factory"
import { createServerTask } from "@/features/servers/trigger/provisioning-servers"
import { zfd } from "zod-form-data"

import { actionClient } from "@/lib/safe-action"

const createServerSchema = zfd.formData({})

export const createServer = actionClient
  .schema(createServerSchema)
  .action(async () => {
    const server = await createServerDb({
      name: "Server1",
    })

    const serverType = server.type

    const jobs = serverTypeFactory[serverType]

    await createServerTasks(
      jobs.map((job, order) => ({
        name: job.name,
        serverId: server.id,
        order: order + 1,
      }))
    )

    await createServerTask.trigger({
      totalJobs: jobs.length,
      serverId: server.id,
    })

    // Create server logic here
    return { status: "success" }
  })
