import { updateServer } from "@/features/servers/data-access/server"
import {
  removeServerTasks,
  transitionInProgressServerTask,
  transitionNextServerTask,
} from "@/features/servers/data-access/server-tasks"
import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3"
import dayjs from "dayjs"

import { NewServer } from "@/lib/db/schema"

type PayloadCreateServer = {
  serverId: NewServer["id"]
}

export const createServerTask = task<"create-server", PayloadCreateServer>({
  id: "create-server",
  async onFailure(payload, error, params) {
    // change the state of the server task to "failed"
    logger.error("Failed to create server", { error, params })

    await transitionInProgressServerTask(payload.serverId, "failed")
  },
  maxDuration: 300,
  async onSuccess(payload, output, params) {
    logger.log("Finished create-server task", { id: params.ctx.run.id })

    await Promise.all([
      await transitionInProgressServerTask(payload.serverId, "completed"),
      await transitionNextServerTask(payload.serverId),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Creating server...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await tasks.trigger<typeof installNginxTask>("install-nginx", {
      serverId: payload.serverId,
      batchId: ctx.run.id,
    })

    return {
      message: "Server created!",
    }
  },
})

type PayloadNginx = {
  serverId: string
  batchId: string
}

// Intall nginx
export const installNginxTask = task<"install-nginx", PayloadNginx>({
  id: "install-nginx",
  maxDuration: 300, // 5 minutes
  async onFailure(payload, error, params) {
    logger.error("Failed to install nginx", { error, params })

    await transitionInProgressServerTask(payload.serverId, "failed")
  },
  async onSuccess(payload, output, params) {
    logger.log("Finished install-nginx task", { id: params.ctx.run.id })

    await Promise.all([
      await transitionInProgressServerTask(payload.serverId, "completed"),
      await transitionNextServerTask(payload.serverId),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Installing nginx...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await tasks.trigger<typeof finalizeServerTask>("finalize-server", {
      serverId: payload.serverId,
    })

    return {
      message: "Nginx installed!",
    }
  },
})

type PayloadFinalizeServer = {
  serverId: string
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
      await transitionInProgressServerTask(payload.serverId, "completed"),
      await transitionNextServerTask(payload.serverId),
      await updateServer(payload.serverId, {
        batchId: null,
        // this is the format 2024-10-25 01:43:54
        provisionedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }),
    ])

    await removeServerTasks(payload.serverId)
  },
  async onFailure(payload, error, params) {
    logger.error("Failed to finalize server", { error, params })

    await transitionInProgressServerTask(payload.serverId, "failed")
  },
  maxDuration: 300, // 5 minutes
  run: async (payload: unknown, { ctx }) => {
    logger.log("Finalizing server...", { payload, ctx })

    await wait.for({ seconds: 5 })

    return {
      message: "Server finalized!",
    }
  },
})
