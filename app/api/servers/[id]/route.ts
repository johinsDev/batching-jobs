import { getServer } from "@/features/servers/data-access/server"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const serverId = (await params).id

  const server = await getServer(serverId)

  if (!server) {
    return Response.json({ message: "Server not found" }, { status: 404 })
  }

  return Response.json({ data: server })
}
