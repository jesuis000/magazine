import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import ProductCard from './ProductCard'

function ProductGrid({ storeSlug, categoryId }) {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', storeSlug, categoryId],
        queryFn: () => fetchProducts(storeSlug, categoryId),
        enabled: !!storeSlug,
    })

    if (isLoading) return <div className="text-gray-400 text-sm py-6">Loading products…</div>

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center sm:justify-items-stretch">
            {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
    )
}

export default ProductGrid