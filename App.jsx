import { useMemo, useState } from 'react';
import './App.css';

const ALLERGENS = [
  { id: 'sut', label: 'Süt ve süt ürünleri' },
  { id: 'yumurta', label: 'Yumurta' },
  { id: 'balik', label: 'Balık' },
  { id: 'kabuklu', label: 'Kabuklu deniz ürünleri' },
  { id: 'findik', label: 'Kuruyemiş (fındık, badem vb.)' },
  { id: 'yerfistigi', label: 'Yer fıstığı' },
  { id: 'gluten', label: 'Gluten (buğday, arpa, çavdar)' },
  { id: 'soya', label: 'Soya' },
  { id: 'susam', label: 'Susam' },
  { id: 'hardal', label: 'Hardal' },
  { id: 'keler', label: 'Keler' },
  { id: 'sulfit', label: 'Sülfit / kükürt dioksit' },
];

const initialSelection = () =>
  Object.fromEntries(ALLERGENS.map((a) => [a.id, false]));

export default function App() {
  const [selected, setSelected] = useState(initialSelection);
  const [ingredients, setIngredients] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const activeAllergies = useMemo(
    () => ALLERGENS.filter((a) => selected[a.id]).map((a) => a.label),
    [selected]
  );

  const toggle = (id) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    setResult(null);
    setError(null);
  };

  const selectAll = () => {
    setSelected(Object.fromEntries(ALLERGENS.map((a) => [a.id, true])));
    setResult(null);
    setError(null);
  };

  const clearAll = () => {
    setSelected(initialSelection());
    setResult(null);
    setError(null);
  };

  const analyze = async () => {
    setError(null);
    setResult(null);

    if (!ingredients.trim()) {
      setError('Lütfen yemek içeriğini veya etiket metnini yapıştırın.');
      return;
    }
    if (activeAllergies.length === 0) {
      setError('En az bir alerji seçin.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          allergies: activeAllergies,
          ingredientsText: ingredients.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || data.error || `Sunucu hatası (${res.status})`);
      }
      setResult(data);
    } catch (e) {
      setError(e.message || 'Bağlantı kurulamadı.');
    } finally {
      setLoading(false);
    }
  };

  const verdictClass =
    result?.verdict === 'risky'
      ? 'verdict risky'
      : result?.verdict === 'safe'
        ? 'verdict safe'
        : 'verdict';

  const verdictLabel =
    result?.verdict === 'risky'
      ? 'Riskli'
      : result?.verdict === 'safe'
        ? 'Güvenli'
        : null;

  return (
    <div className="app">
      <header className="header">
        <p className="eyebrow">Gizli gıda alerjenleri</p>
        <h1 className="title">AlerjiSavar</h1>
        <p className="subtitle">
          Alerjilerinizi seçin, içerik listesini yapıştırın; yapay zeka metni tarayıp{' '}
          <strong>Güvenli</strong> veya <strong>Riskli</strong> sonucunu özetler.
        </p>
      </header>

      <main className="main">
        <section className="card">
          <div className="card-head">
            <h2>Alerjileriniz</h2>
            <div className="card-actions">
              <button type="button" className="link-btn" onClick={selectAll}>
                Tümünü seç
              </button>
              <button type="button" className="link-btn" onClick={clearAll}>
                Temizle
              </button>
            </div>
          </div>
          <div className="allergen-grid" role="group" aria-label="Alerji seçimi">
            {ALLERGENS.map((a) => (
              <label key={a.id} className={`chip ${selected[a.id] ? 'on' : ''}`}>
                <input
                  type="checkbox"
                  checked={selected[a.id]}
                  onChange={() => toggle(a.id)}
                  hidden
                />
                <span>{a.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>İçerik / etiket metni</h2>
          <p className="hint">Ürün arkasındaki içindekiler listesini veya menü açıklamasını buraya yapıştırın.</p>
          <textarea
            className="ingredients"
            value={ingredients}
            onChange={(e) => {
              setIngredients(e.target.value);
              setResult(null);
              setError(null);
            }}
            placeholder="Örn: Su, buğday unu, süt özü, yumurta tozu, E322 (lesitin), aroma verici..."
            rows={8}
          />
          <div className="actions">
            <button
              type="button"
              className="primary"
              onClick={analyze}
              disabled={loading}
            >
              {loading ? 'Analiz ediliyor…' : 'Analiz et'}
            </button>
          </div>
          {error && <p className="banner error">{error}</p>}
        </section>

        {result && (
          <section className={`result-card ${result.verdict === 'risky' ? 'is-risky' : 'is-safe'}`}>
            <div className={verdictClass}>
              <span className="verdict-label">{verdictLabel}</span>
            </div>
            {result.summary && <p className="result-summary">{result.summary}</p>}
            {Array.isArray(result.detected) && result.detected.length > 0 && (
              <div className="detected">
                <h3>İlgili ifadeler</h3>
                <ul>
                  {result.detected.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="disclaimer">
              Bu sonuç bilgilendirme amaçlıdır; mutlak tıbbi veya hukuki tavsiye değildir. Şüphede
              doktorunuza danışın ve üreticiyi doğrulayın.
            </p>
          </section>
        )}
      </main>

      <footer className="footer">
        <span>AlerjiSavar — içerik listesi risk analizi</span>
      </footer>
    </div>
  );
}