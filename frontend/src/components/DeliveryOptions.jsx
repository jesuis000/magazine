import {useCheckoutStore} from '../store/checkoutStore'

const SLOTS = [
    {key: 'asap', label: 'اقرب وقت', isAsap: true},
    {key: 'tomorrow_morning', label: 'غداً صباحاً'},
    {key: 'tomorrow_afternoon', label: 'غداً ظهرا'},
    {key: 'tomorrow_evening', label: 'غداً مساءاً'},
    {key: 'in_2_hours', label: 'بعد 2 ساعه'},
]

function DeliveryOptions() {
    const fulfillmentType = useCheckoutStore((s) => s.fulfillmentType)
    const deliverySlot = useCheckoutStore((s) => s.deliverySlot)
    const setFulfillmentType = useCheckoutStore((s) => s.setFulfillmentType)
    const setDeliverySlot = useCheckoutStore((s) => s.setDeliverySlot)

    const slotHeaderLabel = fulfillmentType === 'pickup'
        ? 'اختار ميعاد الاستلام'
        : 'اختار ميعاد التوصيل'

    return (
        <div dir="rtl" className="mt-4">
            {/* Pickup vs Delivery toggle — unchanged */}
            <div className="flex gap-2 mb-3">
                <button
                    onClick={() => setFulfillmentType('pickup')}
                    className={`flex-1 h-11 rounded-lg border font-bold text-sm ${
                        fulfillmentType === 'pickup'
                            ? 'bg-gray-100 border-gray-400 text-gray-900'
                            : 'border-gray-200 text-gray-400'
                    }`}
                >
                    استلام من محل
                </button>
                <button
                    onClick={() => setFulfillmentType('delivery')}
                    className={`flex-1 h-11 rounded-lg font-bold text-sm ${
                        fulfillmentType === 'delivery'
                            ? 'bg-red-600 text-white'
                            : 'border border-gray-200 text-gray-400'
                    }`}
                >
                    توصيل للعميل
                </button>
            </div>

            {/* Header now reflects fulfillment type */}
            <div
                className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-bold mb-3">
                <span>{slotHeaderLabel}</span>
            </div>

            <button
                onClick={() => setDeliverySlot('asap')}
                className="w-full h-11 rounded-lg font-bold text-sm mb-3 bg-red-600 text-white"
            >
                اقرب وقت
            </button>

            <div className="grid grid-cols-3 gap-2">
                {SLOTS.filter((s) => !s.isAsap).map((slot) => (
                    <button
                        key={slot.key}
                        onClick={() => setDeliverySlot(slot.key)}
                        className={`h-14 rounded-lg border text-xs font-medium ${
                            deliverySlot === slot.key
                                ? 'border-red-600 text-red-600 bg-red-50'
                                : 'border-gray-200 text-gray-700'
                        }`}
                    >
                        {slot.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default DeliveryOptions