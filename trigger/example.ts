import { logger, task, wait } from "@trigger.dev/sdk/v3"

export const helloWorldTask = task({
  id: "hello-world",
  async onSuccess(payload, output, params) {
    logger.log("Finished hello-world task", { id: params.ctx.run.id })
  },
  maxDuration: 300, // 5 minutes
  run: async (payload: unknown, { ctx }) => {
    logger.log("Hello, world!", { payload, ctx })

    await wait.for({ seconds: 5 })

    return {
      message: "Hello, world!",
    }
  },
})
