// config/database.ts
import env from '#start/env' // 1. Added this import to read environment variables
import app from '@adonisjs/core/services/app'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  /**
   * Default connection used for all queries.
   */
  connection: 'mysql', // Configured to use MySQL

  connections: {
    /**
     * MySQL / MariaDB connection.
     */
    mysql: {
      client: 'mysql2',
      connection: {
        host: env.get('DB_HOST'),
        port: Number(env.get('DB_PORT')), 
        user: env.get('DB_USER'),
        password: env.get('DB_PASSWORD'),
        database: env.get('DB_DATABASE'),
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
      debug: app.inDev,
    },

    // You can safely delete or keep the sqlite/pg/mssql commented blocks below
  },
})

export default dbConfig