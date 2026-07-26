import { useState } from 'react'
import { useCheckoutStore } from '../store/checkoutStore'


const AREAS = ['روكسي', 'مدينة نصر', 'هليوبوليس', 'المعادي'] // placeholder — should come from Store.deliveryZones once it exists

function CustomerInfoForm() {
    const [locating, setLocating] = useState(false)

    const phone = useCheckoutStore((s) => s.phone)
    const name = useCheckoutStore((s) => s.name)
    const area = useCheckoutStore((s) => s.area)
    const address = useCheckoutStore((s) => s.address)
    const email = useCheckoutStore((s) => s.email)
    const rememberMe = useCheckoutStore((s) => s.rememberMe)
    const setCustomerField = useCheckoutStore((s) => s.setCustomerField)
    const setCustomer = useCheckoutStore((s) => s.setCustomer)

    const handlePhoneBlur = async () => {
        if (!phone) return
    }

    const useMyLocation = () => {
        if (!navigator.geolocation) return
        setLocating(true)
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords
                // Reverse geocoding endpoint TBD — for now just drop coords into address
                setCustomerField('address', `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
                setLocating(false)
            },
            () => setLocating(false)
        )
    }

    return (
        <div dir="rtl" className="mt-4">
            <div className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-3 font-bold mb-3">
                <span>بيانات الشخصية</span>
            </div>

            <input
                type="tel"
                value={phone}
                onChange={(e) => setCustomerField('phone', e.target.value)}
                onBlur={handlePhoneBlur}
                placeholder="رقم موبيل"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2"
            />

            <input
                type="text"
                value={name}
                onChange={(e) => setCustomerField('name', e.target.value)}
                placeholder="الاسم"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2"
            />

            <div className="flex gap-2 mb-2">
                {/*<button*/}
                {/*    onClick={useMyLocation}*/}
                {/*    className="w-16 shrink-0 rounded-lg bg-orange-500 text-white text-xs font-bold flex flex-col items-center justify-center"*/}
                {/*>*/}
                {/*    📍 {locating ? '...' : 'مكاني'}*/}
                {/*</button>*/}
                {/*<select*/}
                {/*    value={area}*/}
                {/*    onChange={(e) => setCustomerField('area', e.target.value)}*/}
                {/*    className="flex-1 border border-gray-200 rounded-lg p-3 text-sm"*/}
                {/*>*/}
                {/*    <option value="">من فضلك اختار المنطقه</option>*/}
                {/*    {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}*/}
                {/*</select>*/}
            </div>

            <input
                type="text"
                value={address}
                onChange={(e) => setCustomerField('address', e.target.value)}
                placeholder="العنوان"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2"
            />

            <input
                type="email"
                value={email}
                onChange={(e) => setCustomerField('email', e.target.value)}
                placeholder="الايميل"
                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2"
            />

            <label className="flex items-center gap-2 text-xs text-gray-600">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setCustomerField('rememberMe', e.target.checked)}
                />
                الاحتفاظ بالبيانات الشخصية لاستخدمها في المره القادمه
            </label>
        </div>
    )
}

export default CustomerInfoForm