const express = require("express");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const PORT = 3030;

function openFolderInExplorer(folderPath) {
    let command;
    switch (process.platform) {
        case "darwin":
            command = `open "${folderPath}"`;
            break;
        case "win32":
            command = `start explorer "${folderPath}"`;
            break;
        default:
            console.log("Unsupported platform");
            return;
    }

    exec(command, { shell: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
}

//CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

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

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
