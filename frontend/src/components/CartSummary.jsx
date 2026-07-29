import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import CustomerInfoForm from './CustomerInfoForm'
import PaymentAndSubmit from './PaymentAndSubmit'
import OrderSuccess from './OrderSuccess'
import NotesSection from './NotesSection'
import { Printer, Pencil, Plus, Minus, Trash2, Check, ShoppingCart, X } from 'lucide-react'

const DELIVERY_FEE = 10

function CartSummary({ onClose, store }) {
    const items = useCartStore((s) => s.items)
    const setQty = useCartStore((s) => s.setQty)
    const orderSubmitted = useCheckoutStore((s) => s.orderSubmitted)

    // Track ID of product currently being edited inline
    const [editingProductId, setEditingProductId] = useState(null)

    const itemList = Object.values(items)

    const lines = itemList.map(({ product, qty }) => {
        const unitPrice = product.discountPrice ?? product.price
        const discount = product.discountPrice != null ? product.price - product.discountPrice : 0
        return { product, qty, unitPrice, discount, lineTotal: unitPrice * qty }
    })

    const itemCount = lines.length
    const totalQty = lines.reduce((s, l) => s + l.qty, 0)
    const savings = lines.reduce((s, l) => s + l.discount * l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
    const netTotal = subtotal + DELIVERY_FEE
    const currency = (store?.currency || 'EGP').toUpperCase()

    const handleIncrement = (product, currentQty) => {
        setQty(product, currentQty + 1)
    }

    const handleDecrement = (product, currentQty) => {
        if (currentQty <= 1) {
            setQty(product, 0)
            setEditingProductId(null)
        } else {
            setQty(product, currentQty - 1)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-fadeIn p-0 sm:p-4"
            onClick={onClose}
        >
            <div
                dir="rtl"
                className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl transition-all border border-gray-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Fixed Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/80 shrink-0">
                    <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-[#00764D]" />
                        <h2 className="text-sm sm:text-base font-extrabold text-gray-800">سلة التسوق</h2>
                        {!orderSubmitted && itemCount > 0 && (
                            <span className="bg-[#00764D]/10 text-[#00764D] text-xs font-bold px-2.5 py-0.5 rounded-full">
                                {totalQty} منتج
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-gray-200/60 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                        aria-label="إغلاق"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Single Scrollable Container */}
                <div className="p-5 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                    {orderSubmitted ? (
                        <OrderSuccess onClose={onClose} />
                    ) : itemCount === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                            {/* Empty Cart Visual */}
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-[#00764D] mb-4 shadow-sm">
                                <ShoppingCart className="w-8 h-8 opacity-80" />
                            </div>

                            <h3 className="text-base font-bold text-gray-800 mb-1">
                                سلة التسوق فارغة
                            </h3>
                            <p className="text-xs text-gray-400 mb-6 max-w-[220px]">
                                لم تقم ببدء إضافة أي منتجات إلى السلة بعد
                            </p>

                            <button
                                onClick={onClose}
                                className="h-10 px-6 bg-[#00764D] hover:bg-[#00603e] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
                            >
                                تصفح العروض الآن
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Order Items Table */}
                            <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm bg-white">
                                <table className="w-full text-xs text-right">
                                    <thead>
                                    <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                                        <th className="py-2.5 px-3 font-semibold">صنف</th>
                                        <th className="py-2.5 px-2 font-semibold text-center">كمية</th>
                                        <th className="py-2.5 px-2 font-semibold text-center">سعر الوحدة</th>
                                        <th className="py-2.5 px-2 font-semibold text-center">خصم</th>
                                        <th className="py-2.5 px-3 font-semibold text-left">الإجمالي</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {lines.map((line) => {
                                        const isEditing = editingProductId === line.product.id

                                        return (
                                            <tr
                                                key={line.product.id}
                                                className={`transition-colors ${
                                                    isEditing ? 'bg-emerald-50/40' : 'hover:bg-gray-50/50'
                                                }`}
                                            >
                                                {/* Product Title & Edit Toggle */}
                                                <td className="py-2.5 px-3">
                                                    <div className="flex items-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingProductId(isEditing ? null : line.product.id)}
                                                            className={`p-1 rounded-md transition-colors shrink-0 ${
                                                                isEditing
                                                                    ? 'text-[#00764D] bg-emerald-100'
                                                                    : 'text-gray-400 hover:text-[#00764D]'
                                                            }`}
                                                            title={isEditing ? 'إنهاء التعديل' : 'تعديل الكمية'}
                                                        >
                                                            {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                                                        </button>
                                                        <span
                                                            className="font-semibold text-gray-800 truncate max-w-[120px] sm:max-w-[140px]"
                                                            title={line.product.name}
                                                        >
                                                                {line.product.name}
                                                            </span>
                                                    </div>
                                                </td>

                                                {/* Quantity Controls */}
                                                <td className="py-2.5 px-2 text-center">
                                                    {isEditing ? (
                                                        <div className="inline-flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleIncrement(line.product, line.qty)}
                                                                className="w-5 h-5 rounded-md bg-gray-50 hover:bg-emerald-50 text-[#00764D] flex items-center justify-center transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>

                                                            <span className="font-bold text-xs min-w-[1.25rem] text-center text-gray-900">
                                                                    {line.qty}
                                                                </span>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDecrement(line.product, line.qty)}
                                                                className="w-5 h-5 rounded-md bg-gray-50 hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                                                            >
                                                                {line.qty === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="font-bold text-gray-800">{line.qty}</span>
                                                    )}
                                                </td>

                                                <td className="py-2.5 px-2 text-center text-gray-600" dir="ltr">
                                                    {line.unitPrice.toFixed(2)}
                                                </td>
                                                <td className="py-2.5 px-2 text-center text-emerald-700 font-medium" dir="ltr">
                                                    {line.discount > 0 ? line.discount.toFixed(2) : '-'}
                                                </td>
                                                <td className="py-2.5 px-3 text-left font-extrabold text-gray-900" dir="ltr">
                                                    {line.lineTotal.toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals Breakdown */}
                            <div className="bg-gray-50/80 rounded-2xl p-4 space-y-2 text-xs sm:text-sm border border-gray-100">
                                <div className="flex justify-between text-gray-600">
                                    <span>عدد الأصناف:</span>
                                    <span className="font-bold text-gray-800">{itemCount}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>الكمية الإجمالية:</span>
                                    <span className="font-bold text-gray-800">{totalQty}</span>
                                </div>
                                {savings > 0 && (
                                    <div className="flex justify-between text-[#00764D] font-bold">
                                        <span>إجمالي التوفير:</span>
                                        <span dir="ltr">{savings.toFixed(2)} {currency}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>تكلفة التوصيل:</span>
                                    <span className="font-bold text-gray-800" dir="ltr">{DELIVERY_FEE.toFixed(2)} {currency}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-2.5 mt-2 flex justify-between text-sm sm:text-base font-extrabold text-gray-900">
                                    <span>صافي الإجمالي:</span>
                                    <span className="text-[#00764D]" dir="ltr">
                                        {netTotal.toFixed(2)} {currency}
                                    </span>
                                </div>
                            </div>

                            {/* Secondary Action: Print */}
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="w-full h-10 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 font-bold flex items-center justify-center gap-2 text-xs transition-colors shadow-sm"
                            >
                                <Printer className="w-4 h-4 text-[#00764D]" />
                                <span>طباعة الفاتورة</span>
                            </button>

                            {/* Sub-sections */}
                            <CustomerInfoForm />
                            <NotesSection />
                            <PaymentAndSubmit />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CartSummary