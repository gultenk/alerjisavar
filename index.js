import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const PORT = Number(process.env.PORT) || 8787;

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/analyze', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return res.status(503).json({
      error: 'missing_key',
      message:
        'OPENAI_API_KEY tanımlı değil. Proje kökünde .env dosyası oluşturup anahtarınızı ekleyin, ardından sunucuyu yeniden başlatın.',
    });
  }

  const { allergies, ingredientsText } = req.body || {};
  if (!Array.isArray(allergies) || allergies.length === 0) {
    return res.status(400).json({ error: 'allergies_required', message: 'En az bir alerji gerekli.' });
  }
  if (typeof ingredientsText !== 'string' || !ingredientsText.trim()) {
    return res.status(400).json({ error: 'text_required', message: 'İçerik metni gerekli.' });
  }

  const client = new OpenAI({ apiKey });

  const userBlock = [
    `Kullanıcının bildirdiği alerjiler: ${allergies.join('; ')}`,
    `İçerik / etiket metni:\n${ingredientsText.trim()}`,
  ].join('\n\n');

  try {
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Sen bir gıda güvenliği asistanısın. Görevin: verilen içindekiler/etiket metnini, kullanıcının seçtiği alerjilere göre risk analizi yapmak.

Kurallar:
- E/INS kodları, ticari isimler, dolaylı ifadeler ("may contain", "işlenmiş … ticaretinde kullanılan tesis") ve çapraz bulaşma uyarılarını dikkate al.
- Belirsizlik veya çapraz bulaşma riski varsa genelde "risky" seç; açıkça güvenli değilse ihtiyatlı ol.
- verdict yalnızca "safe" veya "risky" olsun (küçük harf, İngilizce anahtar).
- summary alanı Türkçe, kısa ve net (2-4 cümle).
- detected: metinde veya anlamında kullanıcı alerjileriyle eşleşen kısa alıntılar veya madde adları (dizi); yoksa boş dizi.

Yanıtı ŞU JSON şemasında ver, başka metin ekleme:
{"verdict":"safe"|"risky","summary":"string","detected":["string",...]}`,
        },
        { role: 'user', content: userBlock },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim();
    if (!raw) {
      return res.status(502).json({ error: 'empty_model', message: 'Model yanıt vermedi.' });
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return res.status(502).json({ error: 'invalid_json', message: 'Model yanıtı işlenemedi.' });
    }

    const verdict = parsed.verdict === 'risky' ? 'risky' : 'safe';
    const summary = typeof parsed.summary === 'string' ? parsed.summary : '';
    const detected = Array.isArray(parsed.detected)
      ? parsed.detected.filter((x) => typeof x === 'string').slice(0, 12)
      : [];

    return res.json({ verdict, summary, detected });
  } catch (err) {
    const msg = err?.message || 'Analiz başarısız.';
    const status = err?.status === 401 ? 401 : 502;
    return res.status(status).json({
      error: 'openai_error',
      message: status === 401 ? 'API anahtarı geçersiz olabilir.' : msg,
    });
  }
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`AlerjiSavar API http://localhost:${PORT}`);
});
