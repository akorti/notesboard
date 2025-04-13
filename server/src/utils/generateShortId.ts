import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const DEFAULT_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const CHARSET = process.env.TOKEN_CHARSET || DEFAULT_CHARSET

export function generateShortId(size = 12): string {
    const randomBytes = crypto.randomBytes(size)
    let token = ''

    for (let i = 0; i < size; i++) {
        token += CHARSET[randomBytes[i] % CHARSET.length]
    }

    return token
}
