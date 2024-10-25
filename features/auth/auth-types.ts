export class AuthError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthError"
  }

  static notFound() {
    return new AuthError("User not found")
  }

  static emailNotSent() {
    return new AuthError("Email not sent")
  }

  static accountNotFound(type: string) {
    return new AuthError(
      `No account found associated with the provided ${type}. This email may be used for social login.`
    )
  }

  static invalidCredentials(message?: string) {
    return new AuthError(message || "Invalid credentials")
  }
}
