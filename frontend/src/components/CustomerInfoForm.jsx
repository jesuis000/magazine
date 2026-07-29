import { useCheckoutStore } from '../store/checkoutStore'
import { Phone, User, MapPin, Mail } from 'lucide-react'

function CustomerInfoForm() {
    const phone = useCheckoutStore((s) => s.phone)
    const name = useCheckoutStore((s) => s.name)
    const address = useCheckoutStore((s) => s.address)
    const email = useCheckoutStore((s) => s.email)
    const rememberMe = useCheckoutStore((s) => s.rememberMe)
    const setCustomerField = useCheckoutStore((s) => s.setCustomerField)

    const fields = [
        { icon: Phone, type: 'tel', value: phone, key: 'phone', placeholder: 'رقم موبايل' },
        { icon: User, type: 'text', value: name, key: 'name', placeholder: 'الاسم' },
        { icon: MapPin, type: 'text', value: address, key: 'address', placeholder: 'العنوان' },
        { icon: Mail, type: 'email', value: email, key: 'email', placeholder: 'الايميل' },
    ]

    return (
        <div dir="rtl" className="mt-4 border border-gray-200 rounded-xl p-4 bg-white">
            <p className="font-bold text-sm text-gray-800 mb-3">بيانات التوصيل والشخصية</p>

            <div className="space-y-2.5">
                {fields.map(({ icon: Icon, type, value, key, placeholder }) => (
                    <div key={key} className="relative">
                        <Icon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                            dir="rtl"
                            type={type}
                            value={value}
                            onChange={(e) => setCustomerField(key, e.target.value)}
                            placeholder={placeholder}
                            className="w-full h-11 border border-gray-200 rounded-lg pr-10 pl-3 text-sm text-gray-800 placeholder-gray-400 text-right placeholder:text-right focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-white"
                        />
                    </div>
                ))}
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-600 mt-4 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setCustomerField('rememberMe', e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-700 accent-emerald-700 focus:ring-emerald-600 cursor-pointer"
                />
                الاحتفاظ بالبيانات الشخصية لاستخدامها في المرة القادمة
            </label>
        </div>
    )
}

export default CustomerInfoForm