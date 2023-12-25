const app = require('./src/app');

const PORT = process.env.PORT || 3056;

const server = app.listen(PORT, () => {
    console.log(`Server on listening on ${PORT}`)
})

// close server 
process.on('SIGINT', () => {
    server.close(() => console.log('Server Express Exit!!'));
})