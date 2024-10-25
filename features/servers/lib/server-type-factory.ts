import {
  createServerTask,
  finalizeServerTask,
  installNginxTask,
} from "@/features/servers/trigger/provisioning-servers"
import { Task } from "@trigger.dev/sdk/v3"

import { ServerType } from "@/lib/db/schema"

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
