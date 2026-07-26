import { useParams } from 'react-router-dom'
import { useState } from 'react'
import StoreInfoTab from '../components/admin/StoreInfoTab'
import BannersTab from '../components/admin/BannersTab'
import CategoriesTab from '../components/admin/CategoriesTab'
import ProductsTab from '../components/admin/ProductsTab'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import OrdersTab from '../components/admin/OrdersTab'
import CustomersTab from '../components/admin/CustomersTab'

const TABS = [
    { key: 'store', label: 'بيانات المتجر' },
    { key: 'banners', label: 'البانرات' },
    { key: 'categories', label: 'الأقسام' },
    { key: 'products', label: 'المنتجات' },
    { key: 'orders', label: 'الطلبات' },
    { key: 'customers', label: 'العملاء' },
]

function AdminPage() {
    const { storeSlug } = useParams()
    const [tab, setTab] = useState('store')

    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const doLogout = async () => {
        await logout()
        navigate('/login')
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50">
            <div className="bg-gray-900 text-white text-xs px-4 py-2 flex items-center justify-between">
                <span dir="ltr">{user?.email} · {user?.role}</span>
                <button onClick={doLogout} className="text-red-400 font-bold">تسجيل الخروج</button>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                <h1 className="text-xl font-extrabold mb-4">إدارة المتجر: {storeSlug}</h1>

                <div className="flex flex-wrap gap-1.5 border-b border-gray-200 mb-6">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`px-3 py-2 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 ${
                                tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === 'store' && <StoreInfoTab storeSlug={storeSlug} />}
                {tab === 'banners' && <BannersTab storeSlug={storeSlug} />}
                {tab === 'categories' && <CategoriesTab storeSlug={storeSlug} />}
                {tab === 'products' && <ProductsTab storeSlug={storeSlug} />}
                {tab === 'orders' && <OrdersTab storeSlug={storeSlug} />}
                {tab === 'customers' && <CustomersTab storeSlug={storeSlug} />}
            </div>
        </div>
    )
}

export default AdminPage