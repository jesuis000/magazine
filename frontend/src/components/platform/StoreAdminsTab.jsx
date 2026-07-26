import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchUsers, createStoreAdmin, deleteUser, fetchAllStores } from '../../api/admin'

function StoreAdminsTab() {
    const queryClient = useQueryClient()
    const { data: users } = useQuery({ queryKey: ['admin-users'], queryFn: fetchUsers })
    const { data: stores } = useQuery({ queryKey: ['admin-stores'], queryFn: fetchAllStores })

    const [form, setForm] = useState({ email: '', password: '', storeId: '' })
    const [error, setError] = useState(null)

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })

    const createMutation = useMutation({
        mutationFn: () => createStoreAdmin({ ...form, storeId: parseInt(form.storeId, 10) }),
        onSuccess: () => { setForm({ email: '', password: '', storeId: '' }); invalidate() },
        onError: (err) => setError(err.response?.data?.error || 'حدث خطأ'),
    })

    const deleteMutation = useMutation({ mutationFn: deleteUser, onSuccess: invalidate })

    const storeName = (id) => stores?.find((s) => s.id === id)?.name ?? '—'

    return (
        <div>
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="font-bold text-sm mb-3">إضافة مدير متجر</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                        placeholder="البريد الإلكتروني" dir="ltr"
                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="border border-gray-200 rounded-lg h-9 px-2 text-sm col-span-2"
                    />
                    <input
                        placeholder="كلمة المرور المؤقتة" dir="ltr"
                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="border border-gray-200 rounded-lg h-9 px-2 text-sm"
                    />
                    <select
                        value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })}
                        className="border border-gray-200 rounded-lg h-9 px-2 text-sm"
                    >
                        <option value="">اختر المتجر</option>
                        {stores?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                {error && <p className="text-red-600 text-xs font-bold mb-2">{error}</p>}
                <button
                    onClick={() => { setError(null); createMutation.mutate() }}
                    disabled={!form.email || !form.password || !form.storeId || createMutation.isPending}
                    className="h-9 px-4 rounded-lg bg-green-600 text-white font-bold text-sm"
                >
                    إضافة
                </button>
            </div>

            <div className="space-y-2">
                {users?.filter((u) => u.role === 'STORE_ADMIN').map((u) => (
                    <div key={u.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 text-sm">
                        <div>
                            <div className="font-bold" dir="ltr">{u.email}</div>
                            <div className="text-xs text-gray-400">{storeName(u.storeId)}</div>
                        </div>
                        <button onClick={() => deleteMutation.mutate(u.id)} className="text-red-500 text-xs font-bold">حذف</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StoreAdminsTab