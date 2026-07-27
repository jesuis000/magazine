import {useState} from 'react'
import {useCartStore} from '../store/cartStore'
import QuantityKeypadModal from './QuantityKeypadModal'

function ProductCard({product}) {
    const [modalOpen, setModalOpen] = useState(false)
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false)
    const [isZooming, setIsZooming] = useState(false)
    const [zoomPos, setZoomPos] = useState({x: 50, y: 50})
    const qty = useCartStore((s) => s.getQty(product.id))
    const setQty = useCartStore((s) => s.setQty)

    const hasDiscount = product.discountPrice != null

    const handleMouseMove = (e) => {
        const {left, top, width, height} = e.currentTarget.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100
        setZoomPos({x, y})
    }

    return (
        <div className="border border-gray-200 rounded-lg p-2.5 relative">
            {hasDiscount && (
                <span
                    className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold rounded px-1.5 py-0.5">
                    SALE
                </span>
            )}

            <div className="relative group">
                <div
                    onClick={() => product.image && setImagePreviewOpen(true)}
                    onMouseEnter={() => setIsZooming(true)}
                    onMouseLeave={() => setIsZooming(false)}
                    onMouseMove={handleMouseMove}
                    className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center mb-2 overflow-hidden cursor-zoom-in p-2"
                >
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain"/>
                    ) : (
                        <span className="text-gray-400 text-xs">product photo</span>
                    )}
                </div>

                {/* Desktop magnifier lens — replaces the old full-image hover preview */}
                {product.image && isZooming && (
                    <div
                        className="hidden sm:block absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2
                       w-56 h-56 bg-white rounded-lg shadow-xl border border-gray-200 pointer-events-none"
                        style={{
                            backgroundImage: `url(${product.image})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '250%',
                            backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        }}
                    />
                )}
            </div>

            <div className="text-xs font-bold min-h-[34px]">{product.name}</div>

            <div className="text-sm font-extrabold mb-2">
                {hasDiscount ? (
                    <>
                        <span className="text-red-600">{product.discountPrice}</span>{' '}
                        <span className="line-through text-gray-400 text-xs font-normal">{product.price}</span>
                    </>
                ) : (
                    product.price
                )}
                <span className="text-[10px] text-gray-400 font-semibold mr-1">جم</span>
            </div>

            <div className="flex items-center justify-between bg-[#0d4d43] rounded-md h-9 text-white overflow-hidden">
                <button onClick={() => setQty(product, Math.max(0, qty - 1))}
                        className="w-9 h-full flex items-center justify-center text-lg">
                    −
                </button>
                <button onClick={() => setModalOpen(true)} className="font-bold font-mono flex-1 text-center">
                    {qty}
                </button>
                <button onClick={() => setQty(product, qty + 1)}
                        className="w-9 h-full flex items-center justify-center text-lg">
                    +
                </button>
            </div>

            {modalOpen && (
                <QuantityKeypadModal
                    product={product}
                    initialQty={qty}
                    onConfirm={(newQty) => setQty(product, newQty)}
                    onClose={() => setModalOpen(false)}
                />
            )}

            {/* Mobile/tap full-screen preview */}
            {imagePreviewOpen && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4"
                    onClick={() => setImagePreviewOpen(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-4 w-[90vw] max-w-md aspect-square flex flex-col items-center justify-center relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setImagePreviewOpen(false)}
                            className="absolute -top-3 -right-3 bg-white text-gray-700 text-lg w-9 h-9 rounded-full shadow-md flex items-center justify-center"
                            aria-label="إغلاق"
                        >
                            ✕
                        </button>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="max-w-full max-h-[75%] object-contain"
                        />
                        <div className="mt-3 max-w-xs mx-auto text-center">
                            <p className="text-sm font-bold text-gray-900">{product.name}</p>

                            {product.description && (
                                <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed text-right">
                                    {product.description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductCard