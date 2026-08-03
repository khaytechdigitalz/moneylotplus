import crypto from 'node:crypto'
import env from '#start/env'


export default class EncryptionService {
  /**
   * Derives a consistent 32-byte (256-bit) buffer key from your APP_KEY.
   */
  private static getKey(): Buffer {
    const rawKey = env.get('APP_KEY')
    if (!rawKey) {
      throw new Error('APP_KEY is not defined in environment variables')
    }

    // Call .release() to extract the actual string from the Secret object
    const plainKey = typeof rawKey === 'string' ? rawKey : rawKey.release()

    // Hash APP_KEY to guarantee an exact 32-byte key length for AES-256
    return crypto.createHash('sha256').update(plainKey).digest()
  }


  /**
   * Encrypts a string value using AES-256-GCM
   * @param text Plaintext string to encrypt
   * @returns Base64 encoded string containing (IV + AuthTag + EncryptedData)
   */
  public static encrypt(text: string): string {
    const key = this.getKey()
    // Generate a random 12-byte Initialization Vector (IV)
    const iv = crypto.randomBytes(12)

    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    // Get authorization tag for integrity verification
    const authTag = cipher.getAuthTag()

    // Combine IV, AuthTag, and Encrypted Data into a single object
    const payload = {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      data: encrypted,
    }

    // Return as a clean base64 string
    return Buffer.from(JSON.stringify(payload)).toString('base64')
  }

  /**
   * Decrypts an encrypted payload back into its original string
   * @param encryptedBase64 Base64 string produced by the encrypt function
   * @returns Original decrypted plaintext string
   */
  public static decrypt(encryptedBase64: string): string {
    const key = this.getKey()

    try {
      // Decode the payload
      const jsonString = Buffer.from(encryptedBase64, 'base64').toString('utf8')
      const { iv, authTag, data } = JSON.parse(jsonString)

      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        key,
        Buffer.from(iv, 'hex')
      )

      // Set auth tag to verify content hasn't been altered
      decipher.setAuthTag(Buffer.from(authTag, 'hex'))

      let decrypted = decipher.update(data, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      throw new Error('Failed to decrypt value: Invalid key, corrupted payload, or tampered data.')
    }
  }
}