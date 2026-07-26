import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAllStores, createStore } from '../../api/admin'

function StoresTab() {
    const queryClient = useQueryClient()
    const { data: stores } = useQuery({ queryKey: ['admin-stores'], queryFn: fetchAllStores })

    const [form, setForm] = useState({ slug: '', name: '', themeColor: '#0d4d43', currency: 'EGP' })
    const [error, setError] = useState(null)

    const createMutation = useMutation({
        mutationFn: () => createStore(form),
        onSuccess: () => {
            setForm({ slug: '', name: '', themeColor: '#0d4d43', currency: 'EGP' })
            queryClient.invalidateQueries({ queryKey: ['admin-stores'] })
        },
        onError: (err) => setError(err.response?.data?.error || 'حدث خطأ'),
    })

    return (
        <div>
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="font-bold text-sm mb-3">إنشاء متجر جديد</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                        placeholder="الرابط (slug)" dir="ltr"
                        value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                        className="border border-gray-200 rounded-lg h-9 px-2 text-sm font-mono"
                    />
                    <input
                        placeholder="اسم المتجر"
                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border border-gray-200 rounded-lg h-9 px-2 text-sm"
                    />
                </div>
                {error && <p className="text-red-600 text-xs font-bold mb-2">{error}</p>}
                <button
                    onClick={() => { setError(null); createMutation.mutate() }}
                    disabled={!form.slug || !form.name || createMutation.isPending}
                    className="h-9 px-4 rounded-lg bg-green-600 text-white font-bold text-sm"
                >
                    إنشاء
                </button>
            </div>

            <div className="space-y-2">
                {stores?.map((s) => (
                    <div key={s.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                        <div>
                            <div className="font-bold text-sm">{s.name}</div>
                            <div className="text-xs text-gray-400 font-mono">/{s.slug}</div>
                        </div>
                        <Link to={`/${s.slug}/admin`} className="text-blue-600 text-sm font-bold">إدارة ›</Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StoresTab