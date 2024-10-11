import crypto from "crypto"

const ITERATIONS = 10000

export async function hash(value: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(value, salt, ITERATIONS, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(derivedKey.toString("hex"))
    })
  })
}
