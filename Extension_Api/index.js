const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 8080;

// CORS middleware'i uygula
app.use(cors());

// GET isteği geldiğinde content.js dosyasının içeriğini metin olarak döndür
app.get("/content", (req, res) => {
  fs.readFile("content.js", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Sunucu hatası");
      return;
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(data);
  });
});

app.get("/background", (req, res) => {
  fs.readFile("background.js", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Sunucu hatası");
      return;
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(data);
  });
});

app.get("/language", (req, res) => {
  fs.readFile("language.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Sunucu hatası");
      return;
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(data);
  });
});

app.get("/contentcss", (req, res) => {
  fs.readFile("content.css", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Sunucu hatası");
      return;
    }
    res.setHeader("Content-Type", "text/plain");
    res.send(data);
  });
});

// Sunucuyu belirtilen portta başlat
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
