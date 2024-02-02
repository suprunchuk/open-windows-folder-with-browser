const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = 3030;

// Function to open a folder in the file explorer
function openFolderInExplorer(folderPath) {
    let command;

    // Switch statement to determine the appropriate shell command based on the platform
    switch (process.platform) {
        case "darwin": // For macOS
            command = `open "${folderPath}"`;
            break;
        case "win32": // For Windows
            command = `start explorer "${folderPath}"`;
            break;
        default:
            console.log("Unsupported platform");
            return;
    }

    // Executing the shell command
    exec(command, { shell: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
}

// CORS middleware to enable Cross-Origin Resource Sharing
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Endpoint to open a folder in the file explorer
app.get("/open-folder", (req, res) => {
    const folderPath = req.query.path;
    if (!folderPath) {
        res.status(400).send("Не указан путь к папке");
        return;
    }

    const result = openFolderInExplorer(folderPath);
    if (result instanceof Error) {
        res.status(500).send("Ошибка при открытии папки");
        return;
    } else if (result === "Unsupported platform") {
        res.status(500).send("Платформа не поддерживается");
        return;
    }

    res.send("Папка открыта в проводнике");
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
