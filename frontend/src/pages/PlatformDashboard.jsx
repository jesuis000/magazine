import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import StoresTab from '../components/platform/StoresTab'
import StoreAdminsTab from '../components/platform/StoreAdminsTab'

function PlatformDashboard() {
    const [tab, setTab] = useState('stores')
    const logout = useAuthStore((s) => s.logout)
    const navigate = useNavigate()

    const doLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-extrabold">لوحة التحكم الرئيسية</h1>
                    <button onClick={doLogout} className="text-red-600 text-sm font-bold">تسجيل الخروج</button>
                </div>

                <div className="flex gap-2 border-b border-gray-200 mb-6">
                    <button
                        onClick={() => setTab('stores')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 ${tab === 'stores' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
                    >
                        المتاجر
                    </button>
                    <button
                        onClick={() => setTab('admins')}
                        className={`px-4 py-2 text-sm font-bold border-b-2 ${tab === 'admins' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'}`}
                    >
                        مديرو المتاجر
                    </button>
                </div>

                {tab === 'stores' && <StoresTab />}
                {tab === 'admins' && <StoreAdminsTab />}
            </div>
        </div>
    )
}

export default PlatformDashboard