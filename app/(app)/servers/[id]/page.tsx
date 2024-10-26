import { ServerInfo } from "@/features/servers/components/server-info"

export default async function ServerPage() {
  return (
    <main>
      <div className="py-12">
        <ServerInfo />
      </div>
    </main>
  )
}
