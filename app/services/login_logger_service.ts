// app/services/login_logger_service.ts
import db from '@adonisjs/lucid/services/db'
import { UAParser } from 'ua-parser-js'
import geoip from 'geoip-country' // Super fast, in-memory IP lookup

interface LoginLogData {
  userId: number
  ipAddress: string
  userAgentString: string
  mfaVerified: boolean
}

export async function logUserLogin({ userId, ipAddress, userAgentString, mfaVerified }: LoginLogData) {
  try {
    // 1. Instantiating UAParser correctly for Node.js backend environment
    const parser = new UAParser(userAgentString)
    const result = parser.getResult() // Resolves the parser state completely

    const browser = result.browser.name || 'Unknown Browser'
    const os = result.os.name || 'Unknown OS'
    
    // Fallback logic for device type
    let device = result.device.type || 'Desktop'
    if (!device) {
      device = 'Desktop'
    }

    // 2. Resolve Country from IP address
    let country = 'Unknown'
    
    // Check if it's a localhost/loopback address (which won't exist in geoip database)
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.')) {
      country = 'Localhost / Dev Environment'
    } else {
      const geo = geoip.lookup(ipAddress)
      if (geo && geo.name) {
        country = geo.name // e.g. "Nigeria", "United States"
      }
    }

    // 3. Write directly to the DB
    await db.table('users_logins').insert({
      user_id: userId,
      ip_address: ipAddress,
      country,
      device,
      browser,
      os,
      mfa_verified: mfaVerified ? 1 : 0,
    })
  } catch (error) {
    console.error(`[AUDIT ERROR] Failed to log login activity for user ${userId}:`, error)
  }
}