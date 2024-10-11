import { PropsWithChildren } from "react"

export default function AuthLayout(props: PropsWithChildren<object>) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      {props.children}
    </main>
  )
}
