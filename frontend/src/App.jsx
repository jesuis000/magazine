import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import CatalogHome from './pages/CatalogHome'
import AdminPage from './pages/AdminPage.jsx'
import LoginPage from './pages/LoginPage'
import PlatformDashboard from './pages/PlatformDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <BrowserRouter>
            <Routes>
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
                <Route path="*" element={<Navigate to="/myMarket" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App