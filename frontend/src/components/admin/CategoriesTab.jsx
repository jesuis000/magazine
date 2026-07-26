import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchCategories } from '../../api/categories'
import { createCategory, updateCategory, deleteCategory } from '../../api/admin'

function CategoriesTab({ storeSlug }) {
    const queryClient = useQueryClient()
    const { data: categories } = useQuery({
        queryKey: ['categories', storeSlug],
        queryFn: () => fetchCategories(storeSlug),
    })

    const [newName, setNewName] = useState('')

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['categories', storeSlug] })
        queryClient.invalidateQueries({ queryKey: ['products', storeSlug] })
    }

    const addMutation = useMutation({
        mutationFn: () => createCategory(storeSlug, { name: newName, sortOrder: categories?.length ?? 0 }),
        onSuccess: () => { setNewName(''); invalidate() },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateCategory(storeSlug, id, data),
        onSuccess: invalidate,
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => {
            if (!confirm('حذف القسم سيحذف كل المنتجات بداخله. متأكد؟')) return Promise.reject('cancelled')
            return deleteCategory(storeSlug, id)
        },
        onSuccess: invalidate,
    })

    const label = (text) => (
        <label className="block text-[10px] font-bold text-gray-400 mb-1">{text}</label>
    )

    return (
        <div>
            {/* Add new category */}
            <div className="flex gap-2 mb-6">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="اسم القسم الجديد"
                    className="flex-1 border border-gray-200 rounded-lg h-10 px-3 text-sm"
                />
                <button
                    onClick={() => addMutation.mutate()}
                    disabled={!newName || addMutation.isPending}
                    className="h-10 px-4 rounded-lg bg-green-600 text-white font-bold text-sm shrink-0"
                >
                    إضافة
                </button>
            </div>

            {/* Category list */}
            <div className="space-y-3">
                {categories?.map((cat) => (
                    <div key={cat.id} className="border border-gray-200 rounded-lg p-3 flex flex-col gap-3">

                        {/* Thumbnail + name, grouped as one unit */}
                        <div className="flex items-center gap-3">
                            <img
                                src={cat.bannerImage}
                                alt=""
                                className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0"
                                onError={(e) => { e.target.style.opacity = 0.2 }}
                            />
                            <div className="flex-1 min-w-0">
                                {label('اسم القسم')}
                                <input
                                    defaultValue={cat.name}
                                    onBlur={(e) => updateMutation.mutate({ id: cat.id, data: { ...cat, name: e.target.value } })}
                                    className="w-full border border-gray-200 rounded-lg h-9 px-2 text-sm font-bold"
                                />
                            </div>
                        </div>

                        {/* Image URL */}
                        <div>
                            {label('رابط الصورة')}
                            <input
                                defaultValue={cat.bannerImage ?? ''}
                                placeholder="https://..."
                                onBlur={(e) => updateMutation.mutate({ id: cat.id, data: { ...cat, bannerImage: e.target.value } })}
                                dir="ltr"
                                className="w-full border border-gray-200 rounded-lg h-9 px-2 text-xs"
                            />
                        </div>

                        {/* Color + delete, grouped tightly together */}
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                {label('اللون')}
                                <input
                                    type="color"
                                    defaultValue={cat.color ?? '#e4a11b'}
                                    onChange={(e) => updateMutation.mutate({ id: cat.id, data: { ...cat, color: e.target.value } })}
                                    className="w-8 h-8 rounded border border-gray-200"
                                />
                            </div>
                            <button
                                onClick={() => deleteMutation.mutate(cat.id)}
                                className="mr-auto text-red-500 text-xs font-bold px-2"
                            >
                                حذف القسم
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoriesTab