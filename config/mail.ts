// config/mail.ts
import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail' // Note: 'transports', not 'drivers'

const mailConfig = defineConfig({
  default: 'smtp',

  from: {
    address: env.get('MAIL_FROM_ADDRESS'),
    name: env.get('MAIL_FROM_NAME'),
  },

  mailers: {
    smtp: transports.smtp({ // Using transports.smtp
      host: env.get('SMTP_HOST'),
      port: env.get('SMTP_PORT'),
      secure: true, // false for port 587, true for 465
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME') || '',
        pass: env.get('SMTP_PASSWORD') || '',
      },
    }),
    
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}