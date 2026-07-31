import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { ShoppingCart, X, Plus, Minus } from 'lucide-react'

function ProductDetailModal({ product, onClose }) {
    const cartQty = useCartStore((s) => s.getQty(product.id))
    const setQty = useCartStore((s) => s.setQty)
    const [qty, setLocalQty] = useState(cartQty > 0 ? cartQty : 1)

    const hasDiscount = product.discountPrice != null
    const displayPrice = hasDiscount ? product.discountPrice : product.price
    const totalPrice = displayPrice * qty

    const handleAddToCart = () => {
        setQty(product, qty)
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
            onClick={onClose}
        >
            <div
                dir="rtl"
                className="relative bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Sleek Inside Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 left-3 bg-gray-100 hover:bg-gray-200 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    aria-label="إغلاق"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* 2. Optimized Image Container */}
                <div className="border border-gray-100 bg-gray-50/50 rounded-xl h-56 flex items-center justify-center overflow-hidden mb-4 p-3">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain drop-shadow-sm"
                        />
                    ) : (
                        <span className="text-gray-400 text-xs font-medium">صورة المنتج غير متوفرة</span>
                    )}
                </div>

                {/* Product Name & Details */}
                <div className="text-center space-y-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                        {product.name}
                    </h2>

                    {product.nameEn && (
                        <p className="text-xs text-gray-400 font-medium">{product.nameEn}</p>
                    )}

                    {product.description && (
                        <p className="text-xs text-gray-500 leading-relaxed pt-1 max-w-xs mx-auto whitespace-pre-line">
                            {product.description}
                        </p>
                    )}
                </div>

                {/* Price and Stepper Controls */}
                <div dir="rtl" className="flex items-center justify-between mt-5 pt-3 border-t border-gray-100">
                    {/* Price Section */}
                    <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1 text-[#8B1E1E] font-extrabold text-base">
                            <span>السعر:</span>
                            <span dir="ltr" className="inline-block">
                                {totalPrice} ج.م
                            </span>
                        </div>

                        {hasDiscount && (
                            <div className="text-gray-400 line-through text-xs -mt-0.5" dir="ltr">
                                {product.price * qty} ج.م
                            </div>
                        )}

                        {qty > 1 && (
                            <div className="text-gray-400 text-[10px] -mt-0.5" dir="ltr">
                                {qty} × {displayPrice} ج.م
                            </div>
                        )}
                    </div>

                    {/* 3. Corrected RTL Quantity Pill (+ on Right, - on Left) */}
                    <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 bg-white shadow-sm">
                        <button
                            onClick={() => setLocalQty((q) => q + 1)}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" />
                        </button>

                        <span className="font-bold text-sm min-w-[1.25rem] text-center text-gray-800">
                            {qty}
                        </span>

                        <button
                            onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                            className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                        >
                            <Minus className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>

                {/* 4. Signature Emerald Green Button */}
                <button
                    onClick={handleAddToCart}
                    className="w-full h-11 rounded-xl bg-[#00764D] hover:bg-[#006643] text-white font-bold mt-5 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.98]"
                >
                    <span>أضف إلى السلة</span>
                    <ShoppingCart className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

export default ProductDetailModal