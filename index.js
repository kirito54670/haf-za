const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// CORS açık
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

const memoryFile = path.join(__dirname, "memory.json");

// Hafıza dosyasını oku veya oluştur
function loadMemory() {
  try {
    if (!fs.existsSync(memoryFile)) {
      fs.writeFileSync(memoryFile, JSON.stringify([]));
    }
    const data = fs.readFileSync(memoryFile, "utf8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Hafıza okunamadı:", err);
    return [];
  }
}

// Hafıza dosyasını kaydet
function saveMemory(memory) {
  try {
    fs.writeFileSync(memoryFile, JSON.stringify(memory, null, 2));
  } catch (err) {
    throw new Error("Hafıza kaydedilemedi.");
  }
}

// 🔹 POST /api/memory → yazı ekler
app.post("/api/memory", (req, res) => {
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const memory = loadMemory();
    memory.push(text);
    saveMemory(memory);

    res.json({
      status: "ok",
      message: "Yazı hafızaya kaydedildi.",
      text,
    });
  } catch (err) {
    res.status(500).json({ error: "Dosya erişim hatası" });
  }
});

// 🔹 GET /api/memory → tüm hafızayı döndürür
app.get("/api/memory", (req, res) => {
  try {
    const memory = loadMemory();
    res.json({ memory });
  } catch (err) {
    res.status(500).json({ error: "Dosya erişim hatası" });
  }
});

app.listen(PORT, () => console.log(`🧠 Hafıza API çalışıyor: http://localhost:${PORT}`));
