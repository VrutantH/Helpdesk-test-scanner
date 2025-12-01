// PM2 configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'helpdesk-backend',
      script: './dist/server.js',
      cwd: '/var/www/helpdesk/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3003,
        FRONTEND_URL: 'https://helpdesk.hubblehox.ai',
        MONGODB_URI: 'mongodb://helpdesk-dev:hELpDEsK-DeV2025@34.14.157.13:27017/sac_helpdesk?authSource=admin',
        JWT_SECRET: 'your-super-secret-jwt-key-change-this-in-production',
        SESSION_SECRET: 'your-session-secret-key-change-this',
        MAX_FILE_SIZE: '10485760',
        UPLOAD_PATH: '/var/www/helpdesk/backend/uploads'
      },
      error_file: '~/.pm2/logs/helpdesk-backend-error.log',
      out_file: '~/.pm2/logs/helpdesk-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '10s'
    }
  ]
};
