import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircleIcon } from "lucide-react"
import { toast } from "sonner"

import { client } from "@/lib/auth-client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"

export function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [error, setError] = useState("")

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsSubmitting(true)
    setError("")
    const res = await client.resetPassword({
      newPassword: password,
    })
    if (res.error) {
      toast.error(res.error.message)
    }
    setIsSubmitting(false)
    router.push("/sign-in")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid w-full items-center gap-2">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">New password</Label>
          <PasswordInput
            id="password"
            name="password"
            autoComplete="password"
            placeholder="Password"
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Confirm password</Label>
          <PasswordInput
            id="password"
            name="confirmPassword"
            autoComplete="password"
            placeholder="Password"
          />
        </div>
      </div>
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircleIcon className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button className="mt-4 w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  )
}
