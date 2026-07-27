import {useCheckoutStore} from '../store/checkoutStore'
import {useCartStore} from '../store/cartStore'
import {submitOrder} from '../api/orders'
import {useParams} from 'react-router-dom'

const METHODS = [
    {key: 'CASH', label: 'كاش عند الاستلام'},
    {key: 'CARD', label: 'بطاقة ائتمان'},
    {key: 'WALLET', label: 'محفظة إلكترونية'},
]

// Real cartStore shape (confirmed from cartStore.js):
// items: { [productId]: { product, qty } }
function normalizeCartItems(rawItems) {
    return Object.entries(rawItems || {}).map(([productId, entry]) => ({
        productId: Number(productId),
        quantity: entry.qty,
    }))
}

function PaymentAndSubmit() {
    const paymentMethod = useCheckoutStore((s) => s.paymentMethod)
    const setPaymentMethod = useCheckoutStore((s) => s.setPaymentMethod)
    const submitting = useCheckoutStore((s) => s.submitting)
    const submitError = useCheckoutStore((s) => s.submitError)
    const setSubmitting = useCheckoutStore((s) => s.setSubmitting)
    const setSubmitError = useCheckoutStore((s) => s.setSubmitError)

    const checkout = useCheckoutStore((s) => s)
    const rawCartItems = useCartStore((s) => s.items)
    const clearCart = useCartStore((s) => s.clearCart)
    const resetCheckout = useCheckoutStore((s) => s.reset)

    const cartItems = normalizeCartItems(rawCartItems)

    const {storeSlug} = useParams()

    const validate = () => {
        if (!checkout.phone || !checkout.name ) {
            return 'من فضلك أكمل بيانات التواصل أولاً'
        }
        // if (!checkout.phone || !checkout.name || !checkout.area) {
        //     return 'من فضلك أكمل بيانات التواصل أولاً'
        // }
        // if (!checkout.deliverySlot) {
        //     return 'من فضلك اختر ميعاد التوصيل/الاستلام'
        // }
        if (!cartItems || cartItems.length === 0) {
            return 'تم ارسال طلبك بنجاح'
        }
        if (cartItems.some((i) => !i.productId || !i.quantity)) {
            return 'يوجد صنف غير صالح في السلة'
        }
        return null
    }

    const handleSubmit = async () => {
        const validationError = validate()
        if (validationError) {
            setSubmitError(validationError)
            return
        }

        setSubmitting(true)
        setSubmitError(null)

        let result
        try {
            result = await submitOrder(storeSlug, {
                phone: checkout.phone,
                name: checkout.name,
                area: checkout.area,
                address: checkout.address,
                email: checkout.email,
                fulfillmentType: checkout.fulfillmentType.toUpperCase(),
                deliverySlot: checkout.deliverySlot,
                paymentMethod,
                notesText: checkout.notesText,
                voiceNoteUrl: checkout.voiceNoteUrl,
                items: cartItems.map((i) => ({productId: i.productId, quantity: i.quantity})),
            })
        } catch (err) {
            console.error('Order submission failed', err)
            setSubmitError('حدث خطأ أثناء إرسال الطلب، حاول مرة أخرى')
            setSubmitting(false)
            return
        }

        setSubmitting(false)
        useCheckoutStore.getState().setOrderSubmitted(result.id)
        try {
            clearCart()
            resetCheckout()
        } catch (cleanupErr) {
            console.error('Post-order cleanup failed (order was still created successfully)', cleanupErr)
        }
    }

    return (
        <div dir="rtl" className="mt-4">
            {/*<div*/}
            {/*    className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-bold mb-3">*/}
            {/*    <span>طريقه السداد</span>*/}
            {/*</div>*/}

            {/*<div className="flex gap-3 mb-4">*/}
            {/*    {METHODS.map((m) => (*/}
            {/*        <button*/}
            {/*            key={m.key}*/}
            {/*            onClick={() => setPaymentMethod(m.key)}*/}
            {/*            className={`flex-1 h-16 rounded-lg border-2 text-xs font-bold flex items-center justify-center ${*/}
            {/*                paymentMethod === m.key ? 'border-red-600 text-red-600' : 'border-gray-200 text-gray-500'*/}
            {/*            }`}*/}
            {/*        >*/}
            {/*            {m.label}*/}
            {/*        </button>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {submitError && (
                <div className="text-red-600 text-xs text-center mb-2">{submitError}</div>
            )}

            <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-12 rounded-lg bg-green-700 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
                {submitting ? 'جاري الإرسال...' : 'ارسل'} ✈️
            </button>
        </div>
    )
}

export default PaymentAndSubmit