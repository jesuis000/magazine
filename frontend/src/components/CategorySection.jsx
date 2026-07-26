import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import CategoryBanner from './CategoryBanner'
import ProductCard from './ProductCard'

function CategorySection({ storeSlug, category }) {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', storeSlug, category.id],
        queryFn: () => fetchProducts(storeSlug, category.id),
    })

    return (
        <section className="mt-6">
            <CategoryBanner category={category} />

            {isLoading ? (
                <div className="text-gray-400 text-sm py-6">Loading products…</div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
                    {products?.map((p) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default CategorySection