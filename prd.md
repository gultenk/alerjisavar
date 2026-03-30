# prd

## Kapsam

Bu PRD, mevcut kod yapısına uygun şekilde `AlerjiSavar` uygulamasının davranışını ve sistem sözleşmesini tanımlar.

## Hedefler (Goals)

- Kullanıcıların seçtikleri alerjenlere göre ürün metnini hızlıca değerlendirebilmesini sağlamak
- Sonucu basit ve anlaşılır biçimde `safe` / `risky` olarak sunmak
- Çıktıyı doğrulanabilir kılmak için kısa `detected` ifadeleri göstermek

## Hedef dışı (Non-goals)

- Kesin alerjen tespiti / tıbbi tanı
- Üreticinin resmi alerjen beyanının yerini almak
- Tüm dünya alerjenlerini %100 kapsamaya çalışma (ilk sürüm seçili alerjen listesiyle sınırlı)

## Kullanıcı hikayeleri

- Bir alerjim var; market ürününün içindekiler kısmını yapıştırıp risk seviyesini öğrenmek istiyorum.
- Emin değilim; modelin belirsizlikte `risky` tarafta olmasını ve nedenini kısa özetlemesini istiyorum.

## Fonksiyonel gereksinimler

### UI / Etkileşim

- `Alerjileriniz` alanında seçilebilir çip/checkbox listesi
- `Tümünü seç` ve `Temizle` aksiyonları
- `İçerik / etiket metni` için çok satırlı metin alanı
- `Analiz et` butonu ile API çağrısı
- Hata durumlarında kullanıcıya anlaşılır uyarı gösterimi
- Başarılı analizde sonuç kartı:
  - `Güvenli` / `Riskli` etiketi
  - `summary` metni (varsa)
  - `detected` listesi (varsa)
  - Son olarak bilgilendirme amaçlı yasal uyarı

### API

Backend şunları sağlar:

- `GET /api/health` -> `{ ok: true }`
- `POST /api/analyze`

#### İstek (Request)

`Content-Type: application/json`

```json
{
  "allergies": ["string"],
  "ingredientsText": "string"
}
```

#### Yanıt (Response)

```json
{
  "verdict": "safe" | "risky",
  "summary": "string",
  "detected": ["string", "..."]
}
```

#### Hata durumları

- `400`
  - `allergies_required`: Seçilmiş alerji yok
  - `text_required`: `ingredientsText` boş
- `503`
  - `missing_key`: `OPENAI_API_KEY` tanımlı değil
- `502`
  - Model boş yanıt döndürdü (veya)
  - Model yanıtı beklenen JSON formatında değil
  - Genel OpenAI hata durumu

## AI prompt sözleşmesi

Backend tarafında model, `system` mesajı ile yönlendirilir:

- Sadece JSON döndürmesi istenir
- Yanıt şu şemaya uymalıdır:
  - `verdict`: yalnızca `safe` veya `risky`
  - `summary`: Türkçe, kısa ve net (2-4 cümle)
  - `detected`: kullanıcı alerjileriyle eşleşen kısa ifadelerin listesi (dizi)

Kodda `response_format: { type: 'json_object' }` kullanılıyor ve backend `JSON.parse` ile ayrıştırıyor.

## Non-functional gereksinimler

### Güvenlik ve gizlilik

- OpenAI anahtarı frontend'e gömülmez; sadece backend `process.env` üzerinden okunur.
- CORS her origin'i kabul eder (`cors({ origin: true })`). Prod ortamında origin'ler daraltılmalı.
- Loglar minimum tutulur (şu an sadece sunucu başlatma mesajı).

### Dayanıklılık

- Request boyutu `express.json({ limit: '256kb' })` ile sınırlandırılır.
- Model yanıtı geçersizse uygun HTTP status ile hata dönülür.

### Performans

- `temperature: 0.2` ile daha deterministik sonuç hedeflenir.
- UI tarafında `loading` durumu kullanıcıya gösterilir.

## Kabul kriterleri

- Kullanıcı alerji seçip içerik metni yapıştırdığında sonuç kartı doğru biçimde görüntülenir.
- Alerji seçilmemiş veya metin boş ise uygun hata mesajı görünür.
- API anahtarı eksikse `503` ile Türkçe hata mesajı döner.