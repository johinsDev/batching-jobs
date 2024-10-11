"use client"

import Link from "next/link"
import { forgotPassword } from "@/features/auth/actions/forgot-passowrd"
import { ArrowLeft, CheckCircle2Icon } from "lucide-react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const { execute, status, reset } = useAction(forgotPassword, {
    onSuccess: () => {
      toast.success("Check your email for a reset link")
      // setIsSubmitted(true
    },
    onError: (ctx) => {
      toast.error(ctx.error.serverError)
    },
  })

  const isSubmitting = status === "executing"

  const isSubmitted = status === "hasSucceeded"

  if (isSubmitted) {
    return (
      <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We`ve sent a password reset link to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle2Icon className="size-4" />
              <AlertDescription>
                If you don`t see the email, check your spam folder.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => reset()}
            >
              <ArrowLeft className="mr-2 size-4" /> Back to reset password
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
          <CardDescription>
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={execute}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                />
              </div>
            </div>

            <Button
              className="mt-4 w-full"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/sign-in">
            <Button variant="link" className="px-0">
              Back to sign in
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
