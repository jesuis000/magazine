import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStore } from '../api/admin'

function CreateStorePage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        slug: '', name: '', logoUrl: '', themeColor: '#0d4d43', currency: 'EGP', phone: '',
    })
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

    const submit = async () => {
        setError(null)
        setSubmitting(true)
        try {
            const store = await createStore(form)
            navigate(`/${store.slug}/admin`)
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-md">
                <h1 className="text-xl font-extrabold mb-1">إنشاء متجر جديد</h1>
                <p className="text-xs text-gray-400 mb-5">
                    سيتم إنشاء المتجر ثم تحويلك لصفحة الإدارة لإضافة الأقسام والمنتجات
                </p>

                <label className="block text-xs font-bold mb-1">رابط المتجر (بالإنجليزي، بدون مسافات)</label>
                <input
                    value={form.slug}
                    onChange={update('slug')}
                    placeholder="store unique name"
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-1 font-mono"
                />
                <p className="text-[11px] text-gray-400 mb-3">
                    سيكون رابط متجرك: <span className="font-mono">localhost:5173/{form.slug || '...'}</span>
                </p>

                <label className="block text-xs font-bold mb-1">اسم المتجر</label>
                <input
                    value={form.name}
                    onChange={update('name')}
                    placeholder="متجرى My Store Name"
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-3"
                />

                <label className="block text-xs font-bold mb-1">رابط الشعار (اختياري)</label>
                <input
                    value={form.logoUrl}
                    onChange={update('logoUrl')}
                    placeholder="https://..."
                    dir="ltr"
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-3"
                />

                <div className="flex gap-3 mb-3">
                    <div className="flex-1">
                        <label className="block text-xs font-bold mb-1">اللون الأساسي</label>
                        <input
                            type="color"
                            value={form.themeColor}
                            onChange={update('themeColor')}
                            className="w-full h-10 rounded-lg border border-gray-200"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-bold mb-1">العملة</label>
                        <input
                            value={form.currency}
                            onChange={update('currency')}
                            className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm"
                        />
                    </div>
                </div>

                <label className="block text-xs font-bold mb-1">رقم الهاتف</label>
                <input
                    value={form.phone}
                    onChange={update('phone')}
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-4"
                />

                {error && (
                    <p className="text-red-600 text-xs font-bold mb-3">{error}</p>
                )}

                <button
                    onClick={submit}
                    disabled={!form.slug || !form.name || submitting}
                    className="w-full h-11 rounded-lg bg-blue-600 text-white font-bold text-sm disabled:opacity-50"
                >
                    {submitting ? 'جاري الإنشاء...' : 'إنشاء المتجر'}
                </button>
            </div>
        </div>
    )
}

export default CreateStorePage