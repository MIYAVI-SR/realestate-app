import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

// ダミー物件データ（実際のDBと連携する際はここを置き換える）
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドパレス渋谷', rent: 150000, area: '渋谷区', type: '1LDK', floor: '5F', icon: '🏢' },
  { id: 2, name: 'サンシャインマンション新宿', rent: 120000, area: '新宿区', type: '2LDK', floor: '3F', icon: '🏙️' },
  { id: 3, name: 'ロイヤルコート池袋', rent: 95000, area: '豊島区', type: '1K', floor: '2F', icon: '🏠' },
  { id: 4, name: 'ブルースカイ目黒', rent: 180000, area: '目黒区', type: '2LDK', floor: '8F', icon: '🌇' },
  { id: 5, name: 'シティビュー品川', rent: 135000, area: '品川区', type: '1LDK', floor: '6F', icon: '🏬' },
  { id: 6, name: 'グリーンヒルズ世田谷', rent: 110000, area: '世田谷区', type: '3LDK', floor: '1F', icon: '🌿' },
]

const Properties = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

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

      {/* 物件一覧 */}
      <main className="properties-container">
        <h2>物件一覧</h2>
        <div className="properties-grid">
          {DUMMY_PROPERTIES.map((property) => (
            <div key={property.id} className="property-card">
              {/* カードヘッダー（アイコン） */}
              <div className="property-card-header">
                <span>{property.icon}</span>
              </div>
              {/* カード本体 */}
              <div className="property-card-body">
                <p className="property-name">{property.name}</p>
                <div className="property-info">
                  <div className="property-info-item">
                    <span className="label">エリア</span>
                    <span className="value">{property.area}</span>
                  </div>
                  <div className="property-info-item">
                    <span className="label">間取り</span>
                    <span className="value">{property.type}</span>
                  </div>
                  <div className="property-info-item">
                    <span className="label">階数</span>
                    <span className="value">{property.floor}</span>
                  </div>
                  <div className="property-info-item">
                    <span className="label">家賃</span>
                    <span className="value rent-value">
                      ¥{property.rent.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default Properties
