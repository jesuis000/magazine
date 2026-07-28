import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStores } from '../api/stores'

function StoresListPage() {
    const { data: stores, isLoading, isError } = useQuery({
        queryKey: ['stores'],
        queryFn: fetchStores,
    })

    if (isLoading) return <div className="p-8 text-center text-gray-400">جاري التحميل...</div>
    if (isError) return <div className="p-8 text-center text-red-500">حدث خطأ في تحميل المتاجر</div>

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 p-6">
            <h1 className="text-xl font-extrabold text-center mb-6">اختر المتجر</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {stores?.map((store) => (
                    <Link
                        key={store.id}
                        to={`/${store.slug}`}
                        className="flex flex-col items-center gap-2 bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                    >
                        {store.logoUrl ? (
                            <img
                                src={store.logoUrl}
                                alt={store.name}
                                className="w-16 h-16 rounded-full object-cover border border-gray-200"
                            />
                        ) : (
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl"
                                style={{ backgroundColor: store.themeColor || '#999' }}
                            >
                                {store.name?.charAt(0)}
                            </div>
                        )}
                        <span className="text-sm font-bold text-center">{store.name}</span>
                    </Link>
                ))}
            </div>

            {stores?.length === 0 && (
                <p className="text-center text-gray-400 mt-10">لا توجد متاجر متاحة حالياً</p>
            )}
        </div>
    )
}

export default StoresListPage