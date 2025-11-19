// PM2 configuration for production deployment
module.exports = {
  apps: [
    {
      name: 'helpdesk-backend',
      script: './dist/server.js',
      cwd: '/var/www/helpdesk/backend',
      instances: 2,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: '/var/log/pm2/helpdesk-backend-error.log',
      out_file: '/var/log/pm2/helpdesk-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
