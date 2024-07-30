import bcrypt from 'bcryptjs'

const saltRounds = 10

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) reject(err)
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) reject(err)
        resolve(hash)
      })
    })
  })
}

export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}
