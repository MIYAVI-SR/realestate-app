import { useState, useEffect } from 'react'

// 物件の新規登録・編集共用モーダルフォーム
// props:
//   property     - 編集対象の物件オブジェクト（nullなら新規登録モード）
//   onSave(data) - 保存処理（親コンポーネントがSupabase操作を担当）
//   onClose      - モーダルを閉じる
const PropertyForm = ({ property, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    rent: '',
    area: '',
    floor_plan: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 編集モードのとき既存データをフォームにセット
  useEffect(() => {
    if (property) {
      setForm({
        name: property.name,
        rent: property.rent,
        area: property.area,
        floor_plan: property.floor_plan,
      })
    }
  }, [property])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave({
        ...form,
        rent: parseInt(form.rent, 10), // 家賃は整数に変換
      })
    } catch (err) {
      setError(err.message || '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    // オーバーレイクリックで閉じる
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h3>{property ? '物件を編集' : '物件を新規登録'}</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>物件名</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="例: グランドパレス渋谷"
              required
            />
          </div>

          <div className="form-group">
            <label>家賃（円）</label>
            <input
              type="number"
              name="rent"
              value={form.rent}
              onChange={handleChange}
              placeholder="例: 120000"
              min={0}
              required
            />
          </div>

          <div className="form-group">
            <label>エリア</label>
            <input
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="例: 渋谷区"
              required
            />
          </div>

          <div className="form-group">
            <label>間取り</label>
            <input
              name="floor_plan"
              value={form.floor_plan}
              onChange={handleChange}
              placeholder="例: 1LDK"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              キャンセル
            </button>
            <button type="submit" className="btn-primary-sm" disabled={loading}>
              {loading ? '保存中...' : '保存する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm
