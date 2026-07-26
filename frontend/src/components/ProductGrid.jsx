import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../api/products'
import ProductCard from './ProductCard'

function ProductGrid({ storeSlug, categoryId }) {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', storeSlug, categoryId],
        queryFn: () => fetchProducts(storeSlug, categoryId),
        enabled: !!categoryId,
    })

    if (isLoading) return <div className="text-gray-400 text-sm py-6">Loading products…</div>

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mt-4">
            {products?.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
    )
}

export default ProductGrid