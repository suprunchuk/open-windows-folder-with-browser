const express = require("express");
const path = require("path");
const { execFile } = require("child_process");

const app = express();
const PORT = 3030;

// Function to open a folder in the file explorer
function openFolderInExplorer(folderPath) {
    if (!isValidFolderPath(folderPath)) {
        throw new Error("Недопустимый путь к папке");
    }

    const platform = process.platform;
    const explorerCommand = platform === "win32" ? "explorer.exe" : "open";
    const args = [folderPath];

    try {
        execFile(explorerCommand, args, { stdio: "ignore" });
        return "Success";
    } catch (error) {
        console.error(`exec error: ${error}`);
        throw new Error("Ошибка при открытии папки");
    }
}

// Function to validate folder path
function isValidFolderPath(folderPath) {
    // Enhanced validation:
    const allowedPaths = ["C:\\ESD", "/path/to/allowed/folder2"];
    return typeof folderPath === "string" && path.isAbsolute(folderPath) && allowedPaths.includes(folderPath);
}

// CORS middleware with more restrictive configuration
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Endpoint to open a folder in the file explorer
app.get("/open-folder", (req, res) => {
    const folderPath = req.query.path;

    if (!isValidFolderPath(folderPath)) {
        res.status(400).send("Недопустимый путь к папке");
        return;
    }

    try {
        openFolderInExplorer(folderPath);
        res.send("Папка открыта в проводнике");
    } catch (error) {
        console.error(error);
        res.status(500).send("Ошибка при открытии папки");
    }
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
