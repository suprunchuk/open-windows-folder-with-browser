const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 3000;

app.get("/open-folder", (req, res) => {
    const folderPath = req.query.path;
    const command = `explorer.exe /select,"${folderPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Ошибка при выполнении команды: ${error}`);
            res.status(500).send({ error: "Ошибка при открытии папки" });
            return;
        }
        console.log(`Папка открыта: ${folderPath}`);
        res.send("Папка успешно открыта");
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
