import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import QuantityKeypadModal from './QuantityKeypadModal'
import CustomerInfoForm from './CustomerInfoForm'
import PaymentAndSubmit from './PaymentAndSubmit'
import OrderSuccess from './OrderSuccess'
import { Printer, Pencil } from 'lucide-react'

const DELIVERY_FEE = 10 // TODO: move to store config once that's modeled

function CartSummary({ onClose, store }) {
    const items = useCartStore((s) => s.items)
    const setQty = useCartStore((s) => s.setQty)
    const orderSubmitted = useCheckoutStore((s) => s.orderSubmitted)
    const [editingProduct, setEditingProduct] = useState(null)

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

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div
                dir="rtl"
                className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4">
                    <button onClick={onClose} className="text-gray-600  text-sm mb-2 block mr-auto">إغلاق ✕</button>

                    {orderSubmitted ? (
                        <OrderSuccess onClose={onClose} />
                    ) : itemCount === 0 ? (
                        <p className="text-gray-400 text-center py-8">السلة فارغة</p>
                    ) : (
                        <>
                            <table className="w-full text-[11.5px]">
                                <thead>
                                <tr className="text-gray-400 border-b border-gray-200">
                                    <th className="py-2 font-semibold">صنف</th>
                                    <th className="py-2 font-semibold">كمية</th>
                                    <th className="py-2 font-semibold">سعر الوحدة</th>
                                    <th className="py-2 font-semibold">خصم</th>
                                    <th className="py-2 font-semibold">الإجمالي</th>
                                </tr>
                                </thead>
                                <tbody>
                                {lines.map((line) => (
                                    <tr key={line.product.id} className="border-b border-gray-100 text-center">
                                        <td className="py-2.5">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setEditingProduct(line.product)}
                                                    className="w-5 h-5 flex items-center justify-center transition-colors hover:text-red-800"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                {line.product.name}
                                            </div>
                                        </td>
                                        <td className="py-2.5">{line.qty}</td>
                                        <td className="py-2.5">{line.unitPrice.toFixed(2)}</td>
                                        <td className="py-2.5">{line.discount.toFixed(2)}</td>
                                        <td className="py-2.5">{line.lineTotal.toFixed(2)}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="text-sm mt-3 space-y-1.5">
                                <div className="flex justify-between"><span>عدد الأصناف</span><span>{itemCount}</span></div>
                                <div className="flex justify-between"><span>الكمية الإجمالية</span><span>{totalQty}</span></div>
                                <div className="flex justify-between"><span>إجمالي التوفير</span><span>{savings.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>تكلفة التوصيل</span><span>{DELIVERY_FEE.toFixed(2)}</span></div>
                                <div className="flex justify-between font-extrabold text-base border-t border-gray-200 pt-2 mt-2">
                                    <span>صافي الإجمالي</span><span dir="ltr">{netTotal.toFixed(2)} {currency}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full h-11 rounded-lg border border-emerald-700 text-emerald-800 bg-white hover:bg-emerald-50 font-bold mt-4 flex items-center justify-center gap-2 transition-colors duration-150"
                            >
                                <Printer className="w-4 h-4 text-emerald-700" />
                                <span>طباعة</span>
                            </button>

                            <CustomerInfoForm />
                            <PaymentAndSubmit />
                        </>
                    )}
                </div>
            </div>

            {editingProduct && (
                <QuantityKeypadModal
                    product={editingProduct}
                    initialQty={items[editingProduct.id]?.qty ?? 0}
                    onConfirm={(newQty) => setQty(editingProduct, newQty)}
                    onClose={() => setEditingProduct(null)}
                />
            )}
        </div>
    )
}

export default CartSummary