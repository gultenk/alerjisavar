# idea

## Proje adı

**AlerjiSavar**

## Problem

Gıda ürünlerinin içerik listesinde yer alan **gizli alerjenler** (dolaylı ifadeler, E/INS kodları, çapraz bulaşma uyarıları, işlenmiş bileşenlerin ticari isimleri vb.) alerjisi olan kişiler için risk oluşturur.

Kullanıcı çoğu zaman ürünün etiket metnini/İçindekiler listesini okuyup tüm olası eşleşmeleri tek başına yorumlayamaz.

## Hedef kullanıcı

- Belirli gıda alerjisi olanlar (ör. süt, yumurta, gluten vb.)
- Market, restoran veya hazır gıda gibi yerlerde ürün içeriği okumak zorunda kalan kişiler

## Çözüm (önerilen akış)

1. Kullanıcı kendi seçtiği alerjenleri ekrandan seçer.
2. Kullanıcı ürünün **içindekiler/etiket** metnini (veya menü açıklamasını) yapıştırır.
3. Uygulama metni tarar ve seçili alerjenlere göre risk analizi yapar.
4. Sonuç ekranda **Güvenli** veya **Riskli** şeklinde özetlenir; ayrıca metinden/ifadelerden kısa eşleşmeler listelenir.

## Yapay zeka rolü

AI, etiket metnini değerlendirerek:

- Kullanıcının seçtiği alerjenlerle eşleşme ihtimalini yorumlar
- Belirsizlik ve olası çapraz bulaşma durumlarını dikkate alır
- Çıktıyı önceden tanımlı bir şemada üretir ve arayüzde güvenli/riskli olarak gösterir

## Yapay zekaya verilen özel kurallar (kısa)

- E/INS kodları ve ticari isimler gibi dolaylı eşleşmeleri göz önünde bulundur
- "may contain", "çapraz bulaşma" gibi uyarıları değerlendir
- Açıkça güvenli değilse ya da belirsizlik varsa genelde **risky** tarafta ol

## Önemli not

Bu uygulama tıbbi tavsiye veya kesin güvence değildir. Şüphe durumunda üretici/uzman doğrulaması gerekir.
