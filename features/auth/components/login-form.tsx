"use client"

import Link from "next/link"
import { signInSchema } from "@/features/auth/validations/sign-in-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { GitHubLogoIcon } from "@radix-ui/react-icons"
import { Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { client } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import GoogleIcon from "@/components/icons/google-icon"

export function LoginForm() {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    await client.signIn.email(
      {
        email: data.email,
        password: data.password,
        dontRememberMe: !data.rememberMe,
        callbackURL: "/dashboard",
      },
      {
        onRequest: () => {
          form.clearErrors()
        },
        onSuccess: () => {
          toast.success("Logged in successfully")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? "Unable to login")
        },
      }
    )
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="grid gap-1">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="grid gap-2">
              <div className="flex items-center">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  required
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 ">
                <FormControl>
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                    ref={field.ref}
                  />
                </FormControl>
                <FormLabel>Remember me</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <Loader2Icon size={16} className="animate-spin" />
          ) : (
            "Login"
          )}
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
            <GoogleIcon />
          </Button>
        </div>
      </form>
    </Form>
  )
}
