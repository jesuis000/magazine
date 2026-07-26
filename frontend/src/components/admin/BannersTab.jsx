import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBanners } from '../../api/banners'
import { createBanner, updateBanner, deleteBanner } from '../../api/admin'

function BannersTab({ storeSlug }) {
    const queryClient = useQueryClient()
    const { data: banners } = useQuery({
        queryKey: ['banners', storeSlug],
        queryFn: () => fetchBanners(storeSlug),
    })

    const [newUrl, setNewUrl] = useState('')

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['banners', storeSlug] })

    const addMutation = useMutation({
        mutationFn: () => createBanner(storeSlug, { imageUrl: newUrl, sortOrder: banners?.length ?? 0 }),
        onSuccess: () => { setNewUrl(''); invalidate() },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateBanner(storeSlug, id, data),
        onSuccess: invalidate,
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteBanner(storeSlug, id),
        onSuccess: invalidate,
    })

    return (
        <div>
            <div className="flex gap-2 mb-6">
                <input
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://... رابط صورة البانر"
                    className="flex-1 border border-gray-200 rounded-lg h-10 px-3 text-sm"
                />
                <button
                    onClick={() => addMutation.mutate()}
                    disabled={!newUrl || addMutation.isPending}
                    className="h-10 px-4 rounded-lg bg-green-600 text-white font-bold text-sm"
                >
                    إضافة
                </button>
            </div>

            <div className="space-y-3">
                {banners?.map((b) => (
                    <div key={b.id} className="flex items-center gap-3 border border-gray-200 rounded-lg p-2">
                        <img src={b.imageUrl} alt="" className="w-24 h-14 object-cover rounded bg-gray-100" onError={(e) => e.target.style.opacity = 0.2} />
                        <input
                            defaultValue={b.imageUrl}
                            onBlur={(e) => updateMutation.mutate({ id: b.id, data: { ...b, imageUrl: e.target.value } })}
                            className="flex-1 border border-gray-200 rounded-lg h-9 px-2 text-xs"
                        />
                        <button onClick={() => deleteMutation.mutate(b.id)} className="text-red-500 text-xs font-bold px-2">
                            حذف
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BannersTab