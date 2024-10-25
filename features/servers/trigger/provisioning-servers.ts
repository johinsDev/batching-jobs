import { createBatch } from "@/features/servers/data-access/batch"
import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3"

import { NewServer } from "@/lib/db/schema"

import { updateServer } from "../data-access/server"

type PayloadCreateServer = {
  totalJobs: number
  serverId: NewServer["id"]
}

export const createServerTask = task<"create-server", PayloadCreateServer>({
  id: "create-server",
  async onSuccess(payload, output, params) {
    logger.log("Finished create-server task", { id: params.ctx.run.id })
  },
  maxDuration: 300, // 5 minutes
  run: async (payload, { ctx }) => {
    logger.log("Creating server...", { payload, ctx })

    await createBatch({
      failedJobs: 0,
      name: "Provisioning server",
      pendingJobs: payload.totalJobs,
      totalJobs: payload.totalJobs,
      id: ctx.run.id,
    })

    logger.log("Batch created")

    const server = await updateServer(payload.serverId, {
      batchId: ctx.run.id,
    })

    logger.log("Server updated")

    await tasks.trigger<typeof installNginxTask>("install-nginx", {
      serverId: server.id,
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
  },
  run: async (payload, { ctx }) => {
    logger.log("Installing nginx...", { payload, ctx })

    await tasks.trigger<typeof installPhp>("install-php", {
      serverId: payload.serverId,
    })

    return {
      message: "Nginx installed!",
    }
  },
})

type PayloadPhp = {
  serverId: string
}

// Install php
export const installPhp = task<"install-php", PayloadPhp>({
  id: "install-php",
  async onSuccess(payload, output, params) {
    logger.log("Finished install-php task", { id: params.ctx.run.id })
  },
  maxDuration: 300, // 5 minutes
  run: async (payload, { ctx }) => {
    logger.log("Installing php...", { payload, ctx })

    await tasks.trigger<typeof finalizeServerTask>("finalize-server", {
      serverId: payload.serverId,
    })

    return {
      message: "Php installed!",
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
