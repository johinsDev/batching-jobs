import {
  getUserByEmail,
  verifyCredentials,
} from "@/features/auth/data-access/users"

class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }

  static userNotFound() {
    return new AuthError("User not found")
  }

  static wrongPassword() {
    return new AuthError("Wrong password")
  }
}

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email)

  if (!user) {
    throw AuthError.userNotFound()
  }

  const isPasswordCorrect = await verifyCredentials(user.id, password)

  if (!isPasswordCorrect) {
    throw AuthError.wrongPassword()
  }

  return user
}
