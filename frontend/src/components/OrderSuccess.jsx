import { useCheckoutStore } from '../store/checkoutStore'

function OrderSuccess({ onClose }) {
    const lastOrderId = useCheckoutStore((s) => s.lastOrderId)
    const clearOrderSubmitted = useCheckoutStore((s) => s.clearOrderSubmitted)

    const handleClose = () => {
        clearOrderSubmitted()
        onClose?.()
    }

    return (
        <div dir="rtl" className="flex flex-col items-center justify-center text-center py-10 px-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg viewBox="0 0 24 24" className="w-9 h-9 text-green-600" fill="none">
                    <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className="text-lg font-bold text-green-700 mb-1">
                تم إرسال طلبك بنجاح
            </div>

            {lastOrderId && (
                <div className="text-sm text-gray-500 mb-6">
                    رقم الطلب: #{lastOrderId}
                </div>
            )}

            <button
                onClick={handleClose}
                className="w-full max-w-xs h-11 rounded-lg bg-green-600 text-white font-bold"
            >
                تمام
            </button>
        </div>
    )
}

export default OrderSuccess