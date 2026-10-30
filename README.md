# Gemini AI Chatbot

Aplikasi chatbot berbasis web dengan backend Node.js + Express dan frontend Vanilla JavaScript. Jawaban dibuat oleh Google Gemini API, dengan persona **Triva**, travel agent yang membantu menyusun itinerary liburan dan hanya menjawab pertanyaan seputar travel.

## Fitur

- Riwayat percakapan dikirim di setiap request, sehingga AI mengingat konteks obrolan
- Jawaban AI dalam format Markdown ditampilkan sebagai teks berformat
- Animasi loading saat menunggu jawaban
- Tampilan bertema kuning

## Cara Menjalankan

Butuh Node.js 18 ke atas dan API key Gemini.

1. Install dependency:

   ```bash
   npm install
   ```

2. Buat file `.env` di root project:

   ```env
   GEMINI_API_KEY=api_key_kamu
   PORT=3000
   ```

   `PORT` bersifat opsional, default-nya 3000.

3. Jalankan server:

   ```bash
   node index.js
   ```

4. Buka `http://localhost:3000` di browser.

## API

### `POST /api/chat`

Request:

```json
{
  "conversation": [
    { "role": "user", "text": "Halo, aku mau liburan ke Bali" },
    { "role": "model", "text": "Halo! Mau berapa lama di Bali?" },
    { "role": "user", "text": "3 hari" }
  ]
}
```

Response sukses (`200`):

```json
{ "result": "Jawaban dari Gemini" }
```

Response gagal (`500`):

```json
{ "error": "Pesan error" }
```

## Struktur Project

```text
gemini-chatbot-api/
├── index.js          # Server Express dan endpoint /api/chat
├── package.json
└── public/           # Frontend
    ├── index.html
    ├── style.css
    └── script.js
```
