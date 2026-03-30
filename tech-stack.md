# tech-stack

## Genel mimari

- Frontend (UI): React + Vite
- Backend (API): Express
- AI entegrasyonu: OpenAI Node SDK

## Kullanilan paketler

- `react`, `react-dom`
- `vite`, `@vitejs/plugin-react`
- `express`
- `cors`
- `dotenv`
- `openai`
- `concurrently` (client ve API'yi ayni anda dev modda calistirmak icin)

## Gelistirme / calistirma

- `npm run dev`
  - `vite` (frontend)
  - `node server/index.js` (backend)
- Vite proxy konfigi:
  - `/api` cagrilari otomatik olarak `http://localhost:8787` adresine gider

## Ortam degiskenleri

- `OPENAI_API_KEY`: Zorunlu
- `OPENAI_MODEL`: Opsiyonel (varsayilan `gpt-4o-mini`)
- `PORT`: Opsiyonel (varsayilan `8787`)

Ornek icin `.env.example` dosyasina bakilir.

## Proje yapisi (mevcut)

- `src/`
  - `App.jsx`: UI ve analiz cagrisi
  - `App.css`: stil
  - `main.jsx`: React root
- `server/`
  - `index.js`: Express API ve OpenAI istemcisi

## Notlar

- Prod ortaminda CORS origin'leri daraltilmali (ornegin sadece kendi domain'in)
- OpenAI anahtari kesinlikle frontend'e gommulmemeli

