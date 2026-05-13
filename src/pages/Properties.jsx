import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import PropertyForm from '../components/PropertyForm'

const Properties = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null) // nullなら新規登録

  // ----------------------------------------
  // SELECT: 自分の物件一覧をSupabaseから取得
  // ----------------------------------------
  const fetchProperties = useCallback(async () => {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false }) // 新着順に表示

    if (error) {
      setError('物件データの取得に失敗しました')
    } else {
      setProperties(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // ----------------------------------------
  // INSERT / UPDATE: フォームからの保存処理
  // ----------------------------------------
  const handleSave = async (formData) => {
    if (editingProperty) {
      // 既存物件を更新（UPDATEはRLSで自分の物件のみ許可）
      const { error } = await supabase
        .from('properties')
        .update(formData)
        .eq('id', editingProperty.id)

      if (error) throw new Error('更新に失敗しました: ' + error.message)
    } else {
      // 新規物件を登録（user_idを明示してRLSポリシーに合致させる）
      const { error } = await supabase
        .from('properties')
        .insert({ ...formData, user_id: user.id })

      if (error) throw new Error('登録に失敗しました: ' + error.message)
    }

    // フォームを閉じて一覧を再取得
    setShowForm(false)
    setEditingProperty(null)
    fetchProperties()
  }

  // ----------------------------------------
  // DELETE: 物件の削除
  // ----------------------------------------
  const handleDelete = async (id) => {
    if (!window.confirm('この物件を削除しますか？')) return

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id)

    if (error) {
      setError('削除に失敗しました')
    } else {
      // 削除成功 — ローカルの配列からも除去（再フェッチより高速）
      setProperties((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // 編集ボタン: 対象物件をフォームにセットして開く
  const handleEdit = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // 新規登録ボタン
  const handleOpenNew = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // フォームを閉じる
  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  // ログアウト
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <>
      {/* ヘッダー */}
      <header className="header">
        <h1>🏠 不動産管理システム</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem', opacity: 0.8 }}>{user?.email}</span>
          <button onClick={handleLogout} className="btn-logout">
            ログアウト
          </button>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="properties-container">
        {/* ツールバー: タイトル + 新規登録ボタン */}
        <div className="properties-toolbar">
          <h2>物件一覧</h2>
          <button className="btn-add" onClick={handleOpenNew}>
            ＋ 新規登録
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-inline">読み込み中...</div>
        ) : properties.length === 0 ? (
          /* 物件が0件の場合の案内 */
          <div className="empty-state">
            <p>登録された物件がありません</p>
            <p>「＋ 新規登録」から物件を追加してください</p>
          </div>
        ) : (
          /* 物件カード一覧 */
          <div className="properties-grid">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="property-card-header">
                  <span>🏠</span>
                </div>
                <div className="property-card-body">
                  <p className="property-name">{property.name}</p>
                  <div className="property-info">
                    <div className="property-info-item">
                      <span className="label">エリア</span>
                      <span className="value">{property.area}</span>
                    </div>
                    <div className="property-info-item">
                      <span className="label">間取り</span>
                      <span className="value">{property.floor_plan}</span>
                    </div>
                    <div className="property-info-item">
                      <span className="label">家賃</span>
                      <span className="value rent-value">
                        ¥{property.rent.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {/* 編集・削除ボタン */}
                  <div className="card-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(property)}
                    >
                      編集
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(property.id)}
                    >
                      削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新規登録・編集モーダル */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSave={handleSave}
          onClose={handleCloseForm}
        />
      )}
    </>
  )
}

export default Properties
