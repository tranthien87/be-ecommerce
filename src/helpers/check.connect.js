const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

// Interval in milliseconds to check for overload
const CHECK_INTERVAL_MS = 5000;

/**
 * Logs the number of active connections to the database.
 */
const countConnect = () => {
    try {
        const connectNum = mongoose.connections.length;
        console.log(`Number of connections --- ${connectNum}`);
    } catch (error) {
        console.error('Error counting connections:', error);
    }
}

/**
 * Periodically checks if the number of active connections exceeds the maximum allowed.
 * Logs memory usage and connection status.
 */
const checkOverLoad = () => {
    setInterval(() => {
        try {
            const connectNum = mongoose.connections.length;
            const numberCore = os.cpus().length;
            const memoryUsage = process.memoryUsage().rss;

            console.log(`Active connections: ${connectNum}`);
            console.log(`Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);

            const maxConnect = numberCore * 5;

            if (connectNum > maxConnect) {
                console.error('Overload connections detected');
            }
        } catch (error) {
            console.error('Error checking overload:', error);
        }
    }, CHECK_INTERVAL_MS);
}

module.exports = { countConnect, checkOverLoad }