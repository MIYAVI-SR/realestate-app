import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

function App() {
  return (
    <BrowserRouter>
      {/* 認証状態をアプリ全体に提供 */}
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* 物件一覧は要認証 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Properties />
              </PrivateRoute>
            }
          />
          {/* 未定義のパスはトップへリダイレクト */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
