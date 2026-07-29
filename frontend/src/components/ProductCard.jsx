import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import ProductDetailModal from './ProductDetailModal'
import { Plus, Minus } from 'lucide-react'

function ProductCard({ product }) {
    const [detailOpen, setDetailOpen] = useState(false)
    const [isZooming, setIsZooming] = useState(false)
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })

    const qty = useCartStore((s) => s.getQty(product.id))
    const setQty = useCartStore((s) => s.setQty)

    const hasDiscount = product.discountPrice != null
    const displayPrice = hasDiscount ? product.discountPrice : product.price

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setZoomPos({ x, y })
    }

    return (
        <div className="bg-white border border-gray-200/80 rounded-2xl p-3 relative flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200 group">
            {/* Discount Badge */}
            {hasDiscount && (
                <span className="absolute top-3 right-3 z-10 bg-red-600 text-white text-[10px] font-bold rounded-lg px-2 py-0.5 shadow-sm">
                    خصم
                </span>
            )}

            {/* Image Frame with Zoom */}
            <div className="relative mb-3">
                <div
                    onClick={() => setDetailOpen(true)}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onMouseMove={handleMouseMove}
                    className="w-full h-40 bg-gray-50/60 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer p-2 transition-colors hover:bg-gray-100/60"
                >
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
                        />
                    ) : (
                        <span className="text-gray-400 text-xs font-medium">صورة المنتج</span>
                    )}
                </div>

                {/* Magnifier Lens */}
                {product.image && isZooming && (
                    <div
                        className="hidden sm:block absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-52 h-52 bg-white rounded-xl shadow-2xl border border-gray-200 pointer-events-none"
                        style={{
                            backgroundImage: `url(${product.image})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '250%',
                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        }}
                    />
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between">
                <div
                    onClick={() => setDetailOpen(true)}
                    className="cursor-pointer mb-2"
                >
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-snug hover:text-[#00764D] transition-colors min-h-[2rem]">
                        {product.name}
                    </h3>
                </div>

                {/* Pricing Display */}
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-sm font-extrabold text-[#8B1E1E]" dir="ltr">
                        {displayPrice} <span className="text-[10px] font-bold">ج.م</span>
                    </span>
                    {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through font-normal" dir="ltr">
                            {product.price}
                        </span>
                    )}
                </div>

                {/* Inline Stepper Bar */}
                <div className="bg-[#00764D] rounded-xl text-white flex items-center justify-between p-1 shadow-sm">
                    <button
                        onClick={() => setQty(product, qty + 1)}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 active:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="زيادة الكمية"
                    >
                        <Plus className="w-4 h-4" />
                    </button>

                    <span className="font-extrabold text-xs sm:text-sm px-2">
                        {qty}
                    </span>

                    <button
                        onClick={() => setQty(product, Math.max(0, qty - 1))}
                        className="w-8 h-8 rounded-lg hover:bg-white/10 active:bg-white/20 flex items-center justify-center transition-colors"
                        aria-label="إنقاص الكمية"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {detailOpen && (
                <ProductDetailModal
                    product={product}
                    onClose={() => setDetailOpen(false)}
                />
            )}
        </div>
    )
}

export default ProductCard