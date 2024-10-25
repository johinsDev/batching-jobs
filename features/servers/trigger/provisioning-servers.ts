import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3"

import { NewServer } from "@/lib/db/schema"

import {
  transitionInProgressServerTask,
  transitionNextServerTask,
} from "../data-access/server-tasks"

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
    ])
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
