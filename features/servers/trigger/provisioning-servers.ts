import { updateServer } from "@/features/servers/data-access/server"
import {
  getNextServerTask,
  removeServerTasks,
  transitionInProgressServerTask,
  transitionNextServerTask,
} from "@/features/servers/data-access/server-tasks"
import { logger, Task, task, wait } from "@trigger.dev/sdk/v3"
import dayjs from "dayjs"

import { NewServer, ServerType } from "@/lib/db/schema"

import { decreasePendingJobs, increaseFailedJobs } from "../data-access/batch"

type TransitionNextJobParams = {
  batchId: string
  server: NewServer
}

async function transitionNextJob({ batchId, server }: TransitionNextJobParams) {
  const jobs = serverTypeFactory[server.type ?? "web"]

  const nextServerTask = await getNextServerTask(server.id)

  if (nextServerTask) {
    console.log("Transitioning task to inprogress", { nextServerTask })

    const job = jobs[nextServerTask.order - 1]

    logger.log("Get next task to run", { job, task: job.task })

    await job.task.trigger({
      server,
      batchId,
    })
  } else {
    logger.error("No pending task found", { serverId: server.id })
  }
}

type PayloadCreateServer = {
  server: NewServer
}

export const createServerTask = task<"create-server", PayloadCreateServer>({
  id: "create-server",
  async onFailure(payload, error, params) {
    // change the state of the server task to "failed"
    logger.error("Failed to create server", { error, params })

    await Promise.all([
      // change the state of the server task to "failed"
      await transitionInProgressServerTask(payload.server.id, "failed"),
      // increase the number of failed jobs by 1
      await increaseFailedJobs(params.ctx.run.id),
    ])
  },
  maxDuration: 300,
  async onSuccess(payload, output, params) {
    logger.log("Finished create-server task", { id: params.ctx.run.id })

    await Promise.all([
      // change the state of the server task to "completed"
      await transitionInProgressServerTask(payload.server.id, "completed"),
      // change the state of the server task to "pending"
      await transitionNextServerTask(payload.server.id),
      // decrease the number of pending jobs by 1
      await decreasePendingJobs(params.ctx.run.id),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Creating server...", {
      payload,
      ctx,
      env: {
        TRIGGER_PROJECT_ID: process.env.TRIGGER_PROJECT_ID,
        DATABASE_URL: process.env.DATABASE_URL,
        DATABASE_AUTH_TOKEN: !!process.env.DATABASE_AUTH_TOKEN,
      },
    })

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

    await Promise.all([
      // change the state of the server task to "failed"
      await transitionInProgressServerTask(payload.server.id, "failed"),
      // increase the number of failed jobs by 1
      await increaseFailedJobs(params.ctx.run.id),
    ])
  },
  async onSuccess(payload, output, params) {
    logger.log("Finished install-nginx task", { id: params.ctx.run.id })

    await wait.for({ seconds: 5 })

    await Promise.all([
      // change the state of the server task to "completed"
      await transitionInProgressServerTask(payload.server.id, "completed"),
      // change the state of the server task to "pending"
      await transitionNextServerTask(payload.server.id),
      // decrease the number of pending jobs by 1
      await decreasePendingJobs(payload.batchId),
    ])
  },
  run: async (payload, { ctx }) => {
    logger.log("Installing nginx...", { payload, ctx })

    await wait.for({ seconds: 5 })

    await transitionNextJob({
      batchId: payload.batchId,
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
      // change the state of the server task to "completed"
      await transitionInProgressServerTask(payload.server.id, "completed"),
      // change the state of the server task to "pending"
      await transitionNextServerTask(payload.server.id),
      // decrease the number of pending jobs by 1
      await decreasePendingJobs(payload.batchId),
      // update the server with the provisionedAt date
      await updateServer(payload.server.id, {
        batchId: null,
        // this is the format 2024-10-25 01:43:54
        provisionedAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      }),
    ])

    // remove all the server tasks
    await removeServerTasks(payload.server.id)
  },
  async onFailure(payload, error, params) {
    logger.error("Failed to finalize server", { error, params })

    await Promise.all([
      // change the state of the server task to "failed"
      await transitionInProgressServerTask(payload.server.id, "failed"),
      // increase the number of failed jobs by 1
      await increaseFailedJobs(params.ctx.run.id),
    ])
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

export const serverTypeFactory: Record<
  ServerType,
  Array<{
    name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    task: Task<string, any>
  }>
> = {
  web: [
    {
      name: "create-server",
      task: createServerTask,
    },
    {
      name: "install-nginx",
      task: installNginxTask,
    },
    {
      name: "finalize-server",
      task: finalizeServerTask,
    },
  ],
  db: [],
  cache: [],
}
