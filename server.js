const http = require("http");
const app = require("./app");
const port = 4000;

const startServer = () => {
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Server berjalan di port ${port}`);
    });

    server.on('error', (error) => {
        console.error('Terjadi kesalahan:', error);
        server.close(() => {
            console.log('Server direstart');
            startServer();  // Merestart server
        });
    });
};

startServer();
