import { useState } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

function LoginPage() {
    const navigate = useNavigate()
    const login = useAuthStore((s) => s.login)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)

    const submit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const user = await login(email, password)
            navigate(user.role === 'SUPER_ADMIN' ? '/admin' : `/${user.storeSlug}/admin`, { replace: true })
        } catch (err) {
            setError(err.response?.data?.error || 'فشل تسجيل الدخول')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div dir="rtl" className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <form onSubmit={submit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-sm">
                <h1 className="text-xl font-extrabold mb-5 text-center">تسجيل الدخول</h1>

                <label className="block text-xs font-bold mb-1">البريد الإلكتروني</label>
                <input
                    type="email" dir="ltr" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-3"
                />

                <label className="block text-xs font-bold mb-1">كلمة المرور</label>
                <input
                    type="password" dir="ltr" required
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm mb-4"
                />

                {error && <p className="text-red-600 text-xs font-bold mb-3">{error}</p>}

                <button
                    type="submit" disabled={submitting}
                    className="w-full h-11 rounded-lg bg-blue-600 text-white font-bold text-sm disabled:opacity-50"
                >
                    {submitting ? 'جاري الدخول...' : 'دخول'}
                </button>

                <Link to="/" className="block text-xs font-bold mb-1 mt-4">
                    <p className="text-[11px] sm:text-xs md:text-sm text-gray-400 flex items-center gap-1">
                        <span>←</span> كل المتاجر
                    </p>
                </Link>

            </form>
        </div>
    )
}

export default LoginPage