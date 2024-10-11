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
}
