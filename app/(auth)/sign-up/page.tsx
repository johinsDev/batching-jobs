import Link from "next/link"
import { RegisterForm } from "@/features/auth/components/register-form"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SingUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email below to register for an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />

          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
