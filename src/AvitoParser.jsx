import { useState } from 'react'
import './AvitoParser.css'

const API_BASE = '/api'

const CITIES = [
  { value: 'rossiya', label: 'Вся Россия' },
  { value: 'moskva', label: 'Москва' },
  { value: 'sankt-peterburg', label: 'Санкт-Петербург' },
  { value: 'kazan', label: 'Казань' },
  { value: 'novosibirsk', label: 'Новосибирск' },
  { value: 'ekaterinburg', label: 'Екатеринбург' },
]

export default function AvitoParser() {
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('moskva')
  const [pages, setPages] = useState(1)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setSearched(true)

    const params = new URLSearchParams({
      q: query.trim(),
      city,
      pages: String(pages),
    })
    if (minPrice) params.set('min_price', minPrice)
    if (maxPrice) params.set('max_price', maxPrice)

    try {
      const res = await fetch(`${API_BASE}/search?${params}`)
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Ошибка запроса')
      }
      setItems(data.items)
    } catch (err) {
      setError(err.message)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="avito-parser">
      <h2>Парсер Avito</h2>
      <p className="avito-parser__hint">
        Поиск объявлений через Playwright-бэкенд. Запустите сервер:{' '}
        <code>cd avito-parser && uvicorn main:app --reload --port 8000</code>
      </p>

      <form className="avito-form" onSubmit={handleSearch}>
        <div className="avito-form__row">
          <label>
            Запрос
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Например: iphone 13"
              required
            />
          </label>
          <label>
            Город
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="avito-form__row">
          <label>
            Страниц
            <input
              type="number"
              min={1}
              max={5}
              value={pages}
              onChange={(e) => setPages(Number(e.target.value))}
            />
          </label>
          <label>
            Цена от
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
            />
          </label>
          <label>
            Цена до
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="∞"
            />
          </label>
        </div>

        <button type="submit" className="avito-form__submit" disabled={loading}>
          {loading ? 'Ищем…' : 'Найти объявления'}
        </button>
      </form>

      {error && <p className="avito-error">{error}</p>}

      {loading && <p className="avito-status">Загрузка выдачи Avito (10–30 сек)…</p>}

      {!loading && searched && !error && (
        <p className="avito-status">Найдено: {items.length} объявлений</p>
      )}

      <ul className="avito-list">
        {items.map((item) => (
          <li key={item.url} className="avito-card">
            {item.image && (
              <img className="avito-card__img" src={item.image} alt="" loading="lazy" />
            )}
            <div className="avito-card__body">
              <a href={item.url} target="_blank" rel="noreferrer" className="avito-card__title">
                {item.title}
              </a>
              {item.price && <p className="avito-card__price">{item.price}</p>}
              {item.location && <p className="avito-card__meta">{item.location}</p>}
              {item.date && <p className="avito-card__meta">{item.date}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
