import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStore } from '../api/stores'
import { fetchBanners } from '../api/banners'
import { fetchCategories } from '../api/categories'
import BannerCarousel from '../components/BannerCarousel.jsx'
import OrderButton from '../components/OrderButton'
import CartSummary from '../components/CartSummary'

import { useState, useEffect, useMemo, useDeferredValue } from 'react'
import CategorySelector from '../components/CategorySelector'
import ProductGrid from '../components/ProductGrid'

import { fetchProducts } from '../api/products'
import ProductCard from '../components/ProductCard'
import { Search, X, ArrowRight } from 'lucide-react'

function CatalogHome() {
    const { storeSlug } = useParams()
    const [cartOpen, setCartOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    const deferredSearchTerm = useDeferredValue(searchTerm)
    const isSearching = deferredSearchTerm.trim().length > 0

    const { data: store, isLoading: storeLoading, isError: storeError } = useQuery({
        queryKey: ['store', storeSlug],
        queryFn: () => fetchStore(storeSlug),
    })

    const { data: banners } = useQuery({
        queryKey: ['banners', storeSlug],
        queryFn: () => fetchBanners(storeSlug),
        enabled: !!store,
    })

    const { data: categories } = useQuery({
        queryKey: ['categories', storeSlug],
        queryFn: () => fetchCategories(storeSlug),
        enabled: !!store,
    })

    const [activeCategoryId, setActiveCategoryId] = useState(null)

    useEffect(() => {
        if (categories?.length && !activeCategoryId) {
            setActiveCategoryId('all')
        }
    }, [categories, activeCategoryId])

    const { data: allProducts, isLoading: searchLoading } = useQuery({
        queryKey: ['products', storeSlug, 'all'],
        queryFn: () => fetchProducts(storeSlug),
        enabled: !!store && isSearching,
    })

    const SEARCHABLE_PRODUCT_FIELDS = ['name', 'description']

    const searchResults = useMemo(() => {
        if (!isSearching || !allProducts) return []
        const term = deferredSearchTerm.trim().toLowerCase()
        return allProducts.filter((p) =>
            SEARCHABLE_PRODUCT_FIELDS.some((field) =>
                p[field]?.toLowerCase().includes(term)
            )
        )
    }, [allProducts, deferredSearchTerm, isSearching])

    if (storeLoading) return <div className="p-8 text-center text-gray-400 font-medium">جاري تحميل المتجر...</div>
    if (storeError || !store) return <div className="p-8 text-center text-red-500 font-medium">المتجر غير موجود.</div>

    const themeColor = store.themeColor || '#00764D'

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50/50 pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Modern Brand Header */}
                <header className="flex items-center justify-between gap-4 py-4 md:py-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        {store.logoUrl ? (
                            <img
                                src={store.logoUrl}
                                alt={store.name}
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border border-gray-200 shadow-sm shrink-0"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                        ) : (
                            <div
                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0"
                                style={{ backgroundColor: themeColor }}
                            >
                                {store.name?.charAt(0)}
                            </div>
                        )}

                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight">
                                مجلة {store.name}
                            </h1>
                            <Link to="/" className="text-xs text-gray-400 hover:text-emerald-700 inline-flex items-center gap-1 transition-colors mt-0.5">
                                <ArrowRight className="w-3 h-3" />
                                <span>كل المتاجر</span>
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Banner Section */}
                <div className="mt-4 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
                    <BannerCarousel banners={banners} />
                </div>

                {/* Search Bar Container */}
                <div className="sticky top-0 z-30 bg-gray-50/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 my-2 transition-all">
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن منتج..."
                            className="w-full h-10 pr-10 pl-10 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 focus:outline-none focus:border-[#00764D] focus:ring-1 focus:ring-[#00764D] shadow-sm transition-all"
                        />
                        {isSearching && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Search Results vs Categories */}
                {isSearching ? (
                    searchLoading ? (
                        <div className="text-gray-400 text-sm py-12 text-center">جاري البحث…</div>
                    ) : searchResults.length ? (
                        <>
                            <p className="text-xs text-gray-400 mb-4 px-1">
                                تم العثور على {searchResults.length} نتيجة لـ «{deferredSearchTerm.trim()}»
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {searchResults.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm py-12 text-center bg-white rounded-2xl border border-gray-100 my-4">
                            لا توجد نتائج لـ «{deferredSearchTerm.trim()}» — جرّب كلمة أخرى
                        </div>
                    )
                ) : (
                    <>
                        <CategorySelector
                            categories={categories}
                            activeCategoryId={activeCategoryId}
                            onSelect={setActiveCategoryId}
                        />
                        {activeCategoryId && (
                            <ProductGrid storeSlug={storeSlug} categoryId={activeCategoryId === 'all' ? null : activeCategoryId} />
                        )}
                    </>
                )}

                {/* Footer Meta */}
                <div className="pt-12 pb-6 text-center border-t border-gray-100 mt-8">
                    <p className="text-gray-400 text-xs font-medium">العملة: {store.currency || 'EGP'}</p>
                </div>
            </div>

            <OrderButton onClick={() => setCartOpen(true)} />
            {cartOpen && <CartSummary store={store} onClose={() => setCartOpen(false)} />}
        </div>
    )
}

export default CatalogHome