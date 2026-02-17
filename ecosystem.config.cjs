
module.exports = {
    apps: [{
        name: 'BLOG',
        script: 'server.js',
        watch: false,
        ignore_watch: ['node_modules', 'coverage', 'logs'],
        env: {
            NODE_ENV: 'development',
            PORT: 8000
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 3001,
            MONGODB_URI: process.env.MONGODB_URI,
            MAIL_USER: process.env.MAIL_USER,
            MAIL_PASSWORD: process.env.MAIL_PASSWORD
        },
        error_files: './logs/ennor.log',
        out_file: './logs/out.log'
    }]
}