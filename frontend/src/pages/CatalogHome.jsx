import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchStore } from '../api/stores'
import { fetchBanners } from '../api/banners'
import { fetchCategories } from '../api/categories'
import BannerCarousel from '../components/BannerCarousel.jsx'
import CategorySection from '../components/CategorySection'
import OrderButton from '../components/OrderButton'
import CartSummary from '../components/CartSummary'

import { useState, useEffect } from 'react'
import CategorySelector from '../components/CategorySelector'
import ProductGrid from '../components/ProductGrid'

function CatalogHome() {
    const { storeSlug } = useParams()
    const [cartOpen, setCartOpen] = useState(false)

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

                {/*{categories?.map((cat) => (*/}
                {/*    <CategorySection key={cat.id} storeSlug={storeSlug} category={cat} />*/}
                {/*))}*/}
                <CategorySelector
                    categories={categories}
                    activeCategoryId={activeCategoryId}
                    onSelect={setActiveCategoryId}
                />

                {activeCategoryId && (
                    <ProductGrid storeSlug={storeSlug} categoryId={activeCategoryId} />
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