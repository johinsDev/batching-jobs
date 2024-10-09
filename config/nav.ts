import { Cog, Globe, HomeIcon, User } from "lucide-react"

import { SidebarLink } from "@/components/SidebarItems"

type AdditionalLinks = {
  title: string
  links: SidebarLink[]
}

export const defaultLinks: SidebarLink[] = [
  { href: "/dashboard", title: "Home", icon: HomeIcon },
  { href: "/settings", title: "Settings", icon: Cog },
]

export const additionalLinks: AdditionalLinks[] = []
