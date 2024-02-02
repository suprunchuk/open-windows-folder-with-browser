const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = 3030;

// Открывает папку в проводнике через браузер
function openFolderInExplorer(folderPath) {
    switch (process.platform) {
        case "darwin":
            exec(`open "${folderPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
            break;
        case "win32":
            exec(`explorer "${folderPath}"`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
            break;
        default:
            console.log("Unsupported platform");
    }
}

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// Маршрут для открытия папки
app.get("/open-folder", (req, res) => {
    const folderPath = req.query.path;
    if (!folderPath) {
        res.status(400).send("Не указан путь к папке");
        return;
    }
    openFolderInExplorer(folderPath);
    res.send("Папка открыта в проводнике");
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
