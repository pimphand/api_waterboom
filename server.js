const http = require("http");
const fs = require("fs");
const path = require("path");
const app = require("./app");
const port = 4000;

// Fungsi untuk mencatat log ke file
const logErrorToFile = (error) => {
    const logDir = path.join(__dirname, "logs");
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir); // Membuat folder jika belum ada
    }

    const date = new Date();
    const logFileName = `${date.toISOString().split("T")[0]}.log`; // Nama file berdasarkan tanggal (YYYY-MM-DD)
    const logFilePath = path.join(logDir, logFileName);

    const logMessage = `[${date.toISOString()}] ${error.stack || error}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error("Gagal mencatat log ke file:", err);
        } else {
            console.log("Error dicatat ke:", logFilePath);
        }
    });
};

const startServer = () => {
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Server berjalan di port ${port}`);
    });

    server.on("error", (error) => {
        console.error("Terjadi kesalahan:", error);
        logErrorToFile(error); // Mencatat log error ke file
        server.close(() => {
            console.log("Server direstart");
            startServer(); // Merestart server
        });
    });
};

startServer();
