"use server"

import { redirect } from "next/navigation"
import { createBatch } from "@/features/servers/data-access/batch"
import {
  createServer as createServerDb,
  updateServer,
} from "@/features/servers/data-access/server"
import { createServerTasks } from "@/features/servers/data-access/server-tasks"
import {
  createServerTask,
  serverTypeFactory,
} from "@/features/servers/trigger/provisioning-servers"
import { zfd } from "zod-form-data"

import { actionClient } from "@/lib/safe-action"

const createServerSchema = zfd.formData({})

export const createServer = actionClient
  .schema(createServerSchema)
  .action(async () => {
    console.log("Creating server...")

    const server = await createServerDb({
      name: "Server1",
    })

    console.log("Server created", { server })

    const serverType = server.type

    const jobs = serverTypeFactory[serverType]

    console.log("Creating server tasks...", { jobs })

    const serverTasks = await createServerTasks(
      jobs.map((job, order) => ({
        name: job.name,
        serverId: server.id,
        order: order + 1,
        state: order === 0 ? "inprogress" : "pending",
      }))
    )

    console.log("Server tasks created", { serverTasks })

    const task = await createServerTask.trigger({
      server,
    })

    console.log("Server provisioning started", { server, task })

    const batch = await createBatch({
      failedJobs: 0,
      name:
        "Provisioning server server #" + server.id + " of type " + serverType,
      pendingJobs: jobs.length,
      totalJobs: jobs.length,
      id: task.id,
    })

    console.log("Batch created", { batch })

    await updateServer(server.id, {
      batchId: task.id,
    })

    console.log("Server updated", { server })

    redirect("/servers/" + server.id)
  })
