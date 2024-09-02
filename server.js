const app = require('./src/app');

const PORT = process.env.PORT || 3000;

const { initRedis } = require('./src/dbs/init.redis');

const startServer = async () => {
    try {
        await initRedis();
        // Start the server only after Redis is initialized
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT || 3000}`);
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            server.close(() => {
                console.log('Server Express Exit!!');
                process.exit(0); // Exit the process after the server is closed
            });
        });
    } catch (error) {
        console.error('Failed to initialize Redis:', error);
        process.exit(1); // Exit the process if Redis initialization fails
    }
};

startServer();