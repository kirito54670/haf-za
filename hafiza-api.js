const express = require('express');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const FILE = './hafiza.json';
if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify({ yazı: "" }));

// Yazı kaydet
app.post('/yaz', (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text gerekli.' });

    const data = { yazı: text };
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    res.json({ success: true, message: 'Yazı kaydedildi.' });
});

// Yazıyı çek
app.get('/oku', (req, res) => {
    const data = JSON.parse(fs.readFileSync(FILE));
    res.json(data);
});

app.get('/', (req, res) => {
    res.send('🧠 Hafıza API çalışıyor!');
});

app.listen(PORT, () => {
    console.log(`Hafıza API aktif: http://localhost:${PORT}`);
});
