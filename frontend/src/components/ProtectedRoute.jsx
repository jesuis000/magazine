import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function ProtectedRoute({ children, requireSuperAdmin = false }) {
    const { storeSlug } = useParams()
    const { user, status, checkSession } = useAuthStore()

    useEffect(() => {
        if (status === 'idle') checkSession()
    }, [status, checkSession])

    if (status === 'idle' || status === 'loading') {
        return <div className="p-8 text-center text-gray-400">جاري التحقق...</div>
    }

    if (status === 'unauthenticated' || !user) {
        return <Navigate to="/login" replace />
    }

    if (requireSuperAdmin && user.role !== 'SUPER_ADMIN') {
        return <div className="p-8 text-center text-red-600 font-bold">غير مصرح لك بالدخول لهذه الصفحة</div>
    }

    if (storeSlug && user.role === 'STORE_ADMIN' && user.storeSlug !== storeSlug) {
        return <div className="p-8 text-center text-red-600 font-bold">غير مصرح لك بإدارة هذا المتجر</div>
    }

    return children
}

export default ProtectedRoute