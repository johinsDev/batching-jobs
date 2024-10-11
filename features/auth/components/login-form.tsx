"use client"

import { useState } from "react"
import Link from "next/link"
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons"
import { Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import { client } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const email = formData.get("email") as string

    const password = formData.get("password") as string

    const rememberMe = formData.get("rememberMe") as string

    client.signIn.email(
      {
        email: email,
        password: password,
        callbackURL: "/dashboard",
        dontRememberMe: !rememberMe,
      },
      {
        onRequest: () => {
          setLoading(true)
        },
        onResponse: () => {
          setLoading(false)
        },
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
      }
    )
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          name="email"
          autoComplete="email"
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          name="password"
          autoComplete="current-password"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox name="rememberMe" />
        <Label>Remember me</Label>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2Icon size={16} className="animate-spin" /> : "Login"}
      </Button>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="w-full gap-2"
          type="button"
          onClick={async () => {
            await client.signIn.social(
              {
                provider: "github",
                callbackURL: "/dashboard",
              },
              {
                onError: (ctx) => {
                  toast.error(ctx.error.message)
                },
              }
            )
          }}
        >
          <GitHubLogoIcon />
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          type="button"
          onClick={async () => {
            await client.signIn.social({
              provider: "discord",
              callbackURL: "/dashboard",
            })
          }}
        >
          <DiscordLogoIcon />
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          type="button"
          onClick={async () => {
            await client.signIn.social(
              {
                provider: "google",
                callbackURL: "/dashboard",
              },
              {
                onError: (ctx) => {
                  toast.error(ctx.error.message)
                },
              }
            )
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="0.98em"
            height="1em"
            viewBox="0 0 256 262"
          >
            <path
              fill="#4285F4"
              d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
              fill="#34A853"
              d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
              fill="#FBBC05"
              d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
            />
            <path
              fill="#EB4335"
              d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2"
          type="button"
          onClick={async () => {
            await client.signIn.social({
              provider: "microsoft",
              callbackURL: "/dashboard",
            })
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M2 3h9v9H2zm9 19H2v-9h9zM21 3v9h-9V3zm0 19h-9v-9h9z"
            ></path>
          </svg>
        </Button>
      </div>
    </form>
  )
}
