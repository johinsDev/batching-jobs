import { Cog, HomeIcon } from "lucide-react"

import { SidebarLink } from "@/components/sidebar-items"

type AdditionalLinks = {
  title: string
  links: SidebarLink[]
}

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/settings", title: "Settings", icon: Cog },
]

export const additionalLinks: AdditionalLinks[] = []
