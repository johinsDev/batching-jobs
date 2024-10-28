import { useQuery } from "@tanstack/react-query"

import { Server, ServerTasks } from "@/lib/db/schema"

type ServerWithTasks = Server & { tasks: Array<ServerTasks> }

export function useServerById(serverId: string) {
  return useQuery({
    enabled: !!serverId,
    queryKey: ["server", serverId],
    queryFn: async () => {
      const res = await fetch(`/api/servers/${serverId}`)

      if (!res.ok) {
        throw new Error(res.statusText)
      }

      const json = (await res.json()) as { data: ServerWithTasks }

      return json.data
    },
    refetchInterval(query) {
      // if server return 404, stop polling
      if (query.state.fetchFailureCount > 2) {
        return false
      }

      if (query.state.data?.provisionedAt) {
        return false
      }

      return 1000
    },
  })
}
