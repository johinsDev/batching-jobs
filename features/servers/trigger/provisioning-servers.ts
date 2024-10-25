import { updateServer } from "@/features/servers/data-access/server"
import {
  removeServerTasks,
  transitionInProgressServerTask,
  transitionNextServerTask,
} from "@/features/servers/data-access/server-tasks"
import { transitionNextJob } from "@/features/servers/lib/transition-next-job"
import { logger, task, wait } from "@trigger.dev/sdk/v3"
import dayjs from "dayjs"

import { NewServer } from "@/lib/db/schema"

type PayloadCreateServer = {
  server: NewServer
}

export const createServerTask = task<"create-server", PayloadCreateServer>({
  id: "create-server",
  async onFailure(payload, error, params) {
    // change the state of the server task to "failed"
    logger.error("Failed to create server", { error, params })

    await transitionInProgressServerTask(payload.server.id, "failed")
  },
  maxDuration: 300,
  async onSuccess(payload, output, params) {
    logger.log("Finished create-server task", { id: params.ctx.run.id })

    await Promise.all([
      await transitionInProgressServerTask(payload.server.id, "completed"),
      await transitionNextServerTask(payload.server.id),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Creating server...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await transitionNextJob({
      batchId: ctx.run.id,
      server: payload.server,
    })

    return {
      message: "Server created!",
    }
  },
})

type PayloadNginx = {
  server: NewServer
  batchId: string
}

// Intall nginx
export const installNginxTask = task<"install-nginx", PayloadNginx>({
  id: "install-nginx",
  maxDuration: 300, // 5 minutes
  async onFailure(payload, error, params) {
    logger.error("Failed to install nginx", { error, params })

    await transitionInProgressServerTask(payload.server.id, "failed")
  },
  async onSuccess(payload, output, params) {
    logger.log("Finished install-nginx task", { id: params.ctx.run.id })

    await Promise.all([
      await transitionInProgressServerTask(payload.server.id, "completed"),
      await transitionNextServerTask(payload.server.id),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Installing nginx...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await transitionNextJob({
      batchId: ctx.run.id,
      server: payload.server,
    })

    return {
      message: "Nginx installed!",
    }
  },
})

type PayloadFinalizeServer = {
  server: NewServer
  batchId: string
}

// finalize server
export const finalizeServerTask = task<
  "finalize-server",
  PayloadFinalizeServer
>({
  id: "finalize-server",
  async onSuccess(payload, output, params) {
    logger.log("Finished finalize-server task", { id: params.ctx.run.id })

    await Promise.all([
      await transitionInProgressServerTask(payload.server.id, "completed"),
      await transitionNextServerTask(payload.server.id),
      await updateServer(payload.server.id, {
        batchId: null,
        // this is the format 2024-10-25 01:43:54
        provisionedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }),
    ])

    await removeServerTasks(payload.server.id)
  },
  async onFailure(payload, error, params) {
    logger.error("Failed to finalize server", { error, params })

    await transitionInProgressServerTask(payload.server.id, "failed")
  },
  maxDuration: 300, // 5 minutes
  run: async (payload, { ctx }) => {
    logger.log("Finalizing server...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await transitionNextJob({
      batchId: ctx.run.id,
      server: payload.server,
    })

    return {
      message: "Server finalized!",
    }
  },
})
