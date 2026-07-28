import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import CatalogHome from './pages/CatalogHome'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage'
import PlatformDashboard from './pages/PlatformDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import StoresListPage from './pages/StoresListPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StoresListPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                    <ProtectedRoute requireSuperAdmin>
                        <PlatformDashboard />
                    </ProtectedRoute>
                } />
                <Route path="/:storeSlug" element={<CatalogHome />} />
                <Route path="/:storeSlug/admin" element={
                    <ProtectedRoute>
                        <AdminPage />
                    </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App