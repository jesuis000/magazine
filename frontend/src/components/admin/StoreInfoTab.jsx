import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchStore } from '../../api/stores'
import { updateStore } from '../../api/admin'

function StoreInfoTab({ storeSlug }) {
    const queryClient = useQueryClient()
    const { data: store } = useQuery({
        queryKey: ['store', storeSlug],
        queryFn: () => fetchStore(storeSlug),
    })

    const [form, setForm] = useState(null)

    useEffect(() => {
        if (store) setForm(store)
    }, [store])

    const mutation = useMutation({
        mutationFn: (data) => updateStore(storeSlug, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['store', storeSlug] }),
    })

    if (!form) return <div className="text-gray-400">Loading…</div>

    const field = (label, key, type = 'text') => (
        <div className="mb-3">
            <label className="block text-xs font-bold mb-1">{label}</label>
            <input
                type={type}
                value={form[key] ?? ''}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg h-10 px-3 text-sm"
            />
        </div>
    )

    return (
        <div className="max-w-md">
            {field('اسم المتجر', 'name')}
            {field('رابط الشعار', 'logoUrl', 'url')}
            {field('اللون الأساسي', 'themeColor')}
            {field('العملة', 'currency')}
            {field('رقم الهاتف', 'phone')}

            <button
                onClick={() => mutation.mutate(form)}
                disabled={mutation.isPending}
                className="mt-2 h-10 px-6 rounded-lg bg-blue-600 text-white font-bold text-sm"
            >
                {mutation.isPending ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            {mutation.isSuccess && <span className="text-green-600 text-xs mr-3">✓ تم الحفظ</span>}
        </div>
    )
}

export default StoreInfoTab