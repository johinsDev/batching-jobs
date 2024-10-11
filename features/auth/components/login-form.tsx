"use client"

import { useState } from "react"
import Link from "next/link"
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
          // onChange={(e) => {
          //   setEmail(e.target.value);
          // }}
          // value={email}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          <Link href="#" className="ml-auto inline-block text-sm underline">
            Forgot your password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          required
          name="password"
          autoComplete="current-password"
          // value={password}
          // onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          name="rememberMe"
          // onClick={() => {
          //   setRememberMe(!rememberMe);
          // }}
        />
        <Label>Remember me</Label>
      </div>

      <Button
        type="submit"
        // type="button"
        className="w-full"
        disabled={loading}
        // onClick={async () => {
        //   await client.signIn.email(
        //     {
        //       email: email,
        //       password: password,
        //       callbackURL: "/dashboard",
        //       dontRememberMe: !rememberMe,
        //     },
        //     {
        //       onRequest: () => {
        //         setLoading(true);
        //       },
        //       onResponse: () => {
        //         setLoading(false);
        //       },
        //       onError: (ctx) => {
        //         toast.error(ctx.error.message);
        //       },
        //     },
        //   );
        // }}
      >
        {loading ? <Loader2Icon size={16} className="animate-spin" /> : "Login"}
      </Button>
      <Button variant="outline" className="w-full">
        Login with Google
      </Button>
    </form>
  )
}
