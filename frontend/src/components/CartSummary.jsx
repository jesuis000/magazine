import { useState } from 'react'
import { useCartStore } from '../store/cartStore'
import QuantityKeypadModal from './QuantityKeypadModal'
import NotesSection from './NotesSection'
import CustomerInfoForm from './CustomerInfoForm'
import DeliveryOptions from './DeliveryOptions'
import PaymentAndSubmit from './PaymentAndSubmit'

const DELIVERY_FEE = 10 // TODO: move to store config once that's modeled

function CartSummary({ onClose }) {
    const items = useCartStore((s) => s.items)
    const setQty = useCartStore((s) => s.setQty)
    const [editingProduct, setEditingProduct] = useState(null)

    const itemList = Object.values(items)

    const lines = itemList.map(({ product, qty }) => {
        const unitPrice = product.discountPrice ?? product.price
        const discount = product.discountPrice != null ? product.price - product.discountPrice : 0
        return {
            product,
            qty,
            unitPrice,
            discount,
            lineTotal: unitPrice * qty,
        }
    })

    const itemCount = lines.length
    const totalQty = lines.reduce((s, l) => s + l.qty, 0)
    const savings = lines.reduce((s, l) => s + l.discount * l.qty, 0)
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
    const netTotal = subtotal + DELIVERY_FEE

    return (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50" onClick={onClose}>
            <div
                dir="rtl"
                className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4">
                    <button onClick={onClose} className="text-blue-600 text-sm mb-2">إغلاق ✕</button>

                    {itemCount === 0 ? (
                        <p className="text-gray-400 text-center py-8">تم ارسال طلبك بنجاح</p>
                    ) : (
                        <>
                            <table className="w-full text-[11.5px]">
                                <thead>
                                <tr className="text-gray-400 border-b border-gray-200">
                                    <th className="py-2 font-semibold">كميه</th>
                                    <th className="py-2 font-semibold">إجمالي</th>
                                    <th className="py-2 font-semibold">سعر</th>
                                    <th className="py-2 font-semibold">خصم</th>
                                    <th className="py-2 font-semibold">صنف</th>
                                </tr>
                                </thead>
                                <tbody>
                                {lines.map((line) => (
                                    <tr key={line.product.id} className="border-b border-gray-100 text-center">
                                        <td className="py-2.5">{line.qty}</td>
                                        <td className="py-2.5">{line.lineTotal.toFixed(2)}</td>
                                        <td className="py-2.5">{line.unitPrice.toFixed(2)}</td>
                                        <td className="py-2.5">{line.discount.toFixed(2)}</td>
                                        <td className="py-2.5">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setEditingProduct(line.product)}
                                                    className="w-5 h-5 rounded bg-red-50 text-red-600 flex items-center justify-center text-[10px]"
                                                >
                                                    ✎
                                                </button>
                                                {line.product.name}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="text-sm mt-3 space-y-1.5">
                                <div className="flex justify-between"><span>عدد الأصناف</span><span>{itemCount.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>الكميه</span><span>{totalQty.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>الوفر</span><span>{savings.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>دليفري</span><span>{DELIVERY_FEE.toFixed(2)}</span></div>
                                <div className="flex justify-between font-extrabold text-base border-t border-gray-200 pt-2 mt-2">
                                    <span>صافي الإجمالي</span><span>{netTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => window.print()}
                                className="w-full h-11 rounded-lg bg-yellow-400 font-bold mt-4"
                            >
                                طباعه
                            </button>

                            {/*<NotesSection />*/}
                            <CustomerInfoForm />
                            {/*<DeliveryOptions />*/}
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