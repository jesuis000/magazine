import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import CustomerInfoForm from './CustomerInfoForm'
import PaymentAndSubmit from './PaymentAndSubmit'
import OrderSuccess from './OrderSuccess'
import { Printer, Pencil, Plus, Minus, Trash2, Check } from 'lucide-react'
import NotesSection from './NotesSection'

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
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 animate-fadeIn" onClick={onClose}>
            <div
                dir="rtl"
                className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-sm mb-2 block mr-auto font-medium transition-colors">
                        إغلاق ✕
                    </button>

                    {orderSubmitted ? (
                        <OrderSuccess onClose={onClose} />
                    ) : itemCount === 0 ? (
                        <p className="text-gray-400 text-center py-12 text-sm font-medium">السلة فارغة</p>
                    ) : (
                        <>
                            <table className="w-full text-[11.5px]">
                                <thead>
                                <tr className="text-gray-400 border-b border-gray-200">
                                    <th className="py-2 text-right font-semibold pr-1">صنف</th>
                                    <th className="py-2 text-center font-semibold">كمية</th>
                                    <th className="py-2 text-center font-semibold">سعر الوحدة</th>
                                    <th className="py-2 text-center font-semibold">خصم</th>
                                    <th className="py-2 text-center font-semibold">الإجمالي</th>
                                </tr>
                                </thead>
                                <tbody>
                                {lines.map((line) => {
                                    const isEditing = editingProductId === line.product.id

                                    return (
                                        <tr key={line.product.id} className={`border-b border-gray-100 transition-colors ${isEditing ? 'bg-emerald-50/40' : ''}`}>
                                            {/* Product Name & Edit Toggle */}
                                            <td className="py-3 pr-1">
                                                <div className="flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => setEditingProductId(isEditing ? null : line.product.id)}
                                                        className={`p-1 rounded-md transition-colors ${
                                                            isEditing ? 'text-emerald-700 bg-emerald-100' : 'text-gray-400 hover:text-emerald-700'
                                                        }`}
                                                        title={isEditing ? 'إنهاء التعديل' : 'تعديل الكمية'}
                                                    >
                                                        {isEditing ? <Check className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <span className="font-medium text-gray-800 truncate max-w-[110px]" title={line.product.name}>
                                                            {line.product.name}
                                                        </span>
                                                </div>
                                            </td>

                                            {/* Inline Quantity Controls */}
                                            <td className="py-3 text-center">
                                                {isEditing ? (
                                                    <div className="flex items-center justify-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm inline-flex">
                                                        <button
                                                            onClick={() => handleIncrement(line.product, line.qty)}
                                                            className="w-5 h-5 rounded-md bg-gray-50 hover:bg-emerald-50 text-emerald-800 flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>

                                                        <span className="font-bold text-xs min-w-[1.25rem] text-center text-gray-900">
                                                                {line.qty}
                                                            </span>

                                                        <button
                                                            onClick={() => handleDecrement(line.product, line.qty)}
                                                            className="w-5 h-5 rounded-md bg-gray-50 hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors"
                                                        >
                                                            {line.qty === 1 ? <Trash2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="font-semibold text-gray-800">{line.qty}</span>
                                                )}
                                            </td>

                                            <td className="py-3 text-center text-gray-600">{line.unitPrice.toFixed(2)}</td>
                                            <td className="py-3 text-center text-gray-500">{line.discount.toFixed(2)}</td>
                                            <td className="py-3 text-center font-bold text-gray-900">{line.lineTotal.toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>

                            <div className="text-sm mt-4 space-y-1.5 text-gray-700">
                                <div className="flex justify-between"><span>عدد الأصناف</span><span>{itemCount}</span></div>
                                <div className="flex justify-between"><span>الكمية الإجمالية</span><span>{totalQty}</span></div>
                                <div className="flex justify-between text-emerald-700 font-medium"><span>إجمالي التوفير</span><span>{savings.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>تكلفة التوصيل</span><span>{DELIVERY_FEE.toFixed(2)}</span></div>
                                <div className="flex justify-between font-extrabold text-base text-gray-900 border-t border-gray-200 pt-2.5 mt-2">
                                    <span>صافي الإجمالي</span>
                                    <span dir="ltr">{netTotal.toFixed(2)} {currency}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full h-11 rounded-xl border border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50/50 font-bold mt-4 flex items-center justify-center gap-2 transition-colors shadow-sm"
                            >
                                <Printer className="w-4 h-4 text-emerald-700" />
                                <span>طباعة</span>
                            </button>

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