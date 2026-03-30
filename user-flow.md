# user-flow

## Akis: Alerji risk analizi

1. Ana ekran
   - Kullanici "Alerjileriniz" bolumunde kendi alerjilerini secer.
   - "Tumunu sec" ve "Temizle" ile secimi hizli yonetir.

2. Icerik metni girme
   - Kullanici "Icerik / etiket metni" alanina urunun icindekiler listesini / etiket metnini / menu aciklamasini yapistirir.

3. Analizi baslatma
   - Kullanici "Analiz et" butonuna tiklar.
   - Validasyonlar:
     - Metin bos ise: hata mesaji gosterilir
     - Hic alerji secilmediyse: hata mesaji gosterilir

4. Yukleniyor durumu
   - Backend cagrisi surerken buton disabled olur.
   - "Analiz ediliyor..." durumu gosterilir.

5. Sonuc ekrani
   - "Guvenli" veya "Riskli" etiketi gosterilir.
   - Varsa "summary" ve "Ilgili ifadeler" listesi gosterilir.
   - En altta bilgilendirme amacli yasal uyari bulunur.

## Hata akislari

- 400 - alerji gerekli: kullanici en az bir alerji secmez.
- 400 - metin gerekli: `ingredientsText` bos gelir.
- 503 - anahtar eksik: backend `OPENAI_API_KEY` bulamaz.
- 502 - model/JSON hatasi: model JSON uretmez veya bos yanit dondurur.

