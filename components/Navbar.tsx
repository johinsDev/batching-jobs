"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AlignRight } from "lucide-react"

import { defaultLinks } from "@/config/nav"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  return (
    <div className="mb-4 w-full border-b pb-2 md:hidden">
      <nav className="flex w-full items-center justify-between">
        <div className="text-lg font-semibold">Logo</div>
        <Button variant="ghost" onClick={() => setOpen(!open)}>
          <AlignRight />
        </Button>
      </nav>
      {open ? (
        <div className="bg-muted my-4 p-4">
          <ul className="space-y-2">
            {defaultLinks.map((link) => (
              <li key={link.title} onClick={() => setOpen(false)} className="">
                <Link
                  href={link.href}
                  className={
                    pathname === link.href
                      ? "text-primary hover:text-primary font-semibold"
                      : "text-muted-foreground hover:text-primary"
                  }
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
