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

function CatalogHome() {
    const { storeSlug } = useParams()
    const [cartOpen, setCartOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    // Smooths out the filtering as someone types, without adding any real delay to the response
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
            setActiveCategoryId(categories[0].id)
        }
    }, [categories, activeCategoryId])

    const { data: allProducts, isLoading: searchLoading } = useQuery({
        queryKey: ['products', storeSlug, 'all'],
        queryFn: () => fetchProducts(storeSlug),
        enabled: !!store && isSearching,
    })

    // The only fields listed here get searched — add more later just by adding to this array
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

    if (storeLoading) return <div className="p-4 text-gray-400">Loading store…</div>
    if (storeError || !store) return <div className="p-4 text-red-500">Store not found.</div>

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="flex flex-row items-center justify-between gap-3 py-4 md:py-6 text-right">
                    <Link to="/" className="block">
                        <h1 className="text-lg sm:text-xl md:text-3xl font-extrabold" style={{ color: store.themeColor }}>
                            مجلة {store.name}
                        </h1>
                        <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 flex items-center gap-1">
                            <span>←</span> كل المتاجر
                        </p>
                    </Link>

                    {store.logoUrl ? (
                        <img
                            src={store.logoUrl}
                            alt={store.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover border border-gray-200 shrink-0"
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    ) : (
                        <div
                            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                            style={{ backgroundColor: store.themeColor || '#999' }}
                        >
                            {store.name?.charAt(0)}
                        </div>
                    )}
                </header>

                <BannerCarousel banners={banners} />

                <div className="sticky top-0 z-30 bg-gray-50 pt-2 pb-1 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="ابحث عن منتج..."
                            className="w-full border border-gray-200 rounded-lg h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white"
                        />
                        {isSearching && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg"
                                aria-label="مسح البحث"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {isSearching ? (
                    searchLoading ? (
                        <div className="text-gray-400 text-sm py-6">جاري البحث…</div>
                    ) : searchResults.length ? (
                        <>
                            <p className="text-xs text-gray-400 mt-3">
                                {searchResults.length} نتيجة لـ «{deferredSearchTerm.trim()}»
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-2">
                                {searchResults.map((p) => <ProductCard key={p.id} product={p} />)}
                            </div>
                        </>
                    ) : (
                        <div className="text-gray-400 text-sm py-6 text-center">
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
                            <ProductGrid storeSlug={storeSlug} categoryId={activeCategoryId} />
                        )}
                    </>
                )}

                <div className="py-6 text-center">
                    <p className="text-gray-400 text-xs">Currency: {store.currency}</p>
                </div>
            </div>

            <OrderButton onClick={() => setCartOpen(true)} />
            {cartOpen && <CartSummary onClose={() => setCartOpen(false)} />}

        </div>
    )
}

export default CatalogHome