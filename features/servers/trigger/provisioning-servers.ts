import { logger, task, tasks, wait } from "@trigger.dev/sdk/v3"

export const createServerTask = task<"create-server", unknown>({
  id: "create-server",
  async onSuccess(payload, output, params) {
    logger.log("Finished create-server task", { id: params.ctx.run.id })
  },
  maxDuration: 300, // 5 minutes

  run: async (payload: unknown, { ctx }) => {
    logger.log("Creating server...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await tasks.trigger<typeof installNginx>("install-nginx", {
      serverId: "123",
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
export const installNginx = task<"install-nginx", PayloadNginx>({
  id: "install-nginx",
  async onSuccess(payload, output, params) {
    logger.log("Finished install-nginx task", { id: params.ctx.run.id })
  },
  maxDuration: 300, // 5 minutes
  async onFailure(payload, error, params) {
    logger.error("Failed to install nginx", { error, params })
  },
  run: async (payload, { ctx }) => {
    logger.log("Installing nginx...", { payload, ctx })

    await wait.for({ seconds: 5 })

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

    await wait.for({ seconds: 5 })

    await tasks.trigger<typeof finalizeServer>("finalize-server", {
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
export const finalizeServer = task<"finalize-server", PayloadFinalizeServer>({
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
