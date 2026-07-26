import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts } from '../../api/products'
import { fetchCategories } from '../../api/categories'
import { createProduct, updateProduct, deleteProduct } from '../../api/admin'

const emptyForm = { name: '', unitLabel: '', price: '', discountPrice: '', image: '', categoryId: '' }

function ProductsTab({ storeSlug }) {
    const queryClient = useQueryClient()
    const { data: products } = useQuery({
        queryKey: ['products', storeSlug, 'all'],
        queryFn: () => fetchProducts(storeSlug),
    })
    const { data: categories } = useQuery({
        queryKey: ['categories', storeSlug],
        queryFn: () => fetchCategories(storeSlug),
    })

    const [form, setForm] = useState(emptyForm)

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products', storeSlug] })

    const addMutation = useMutation({
        mutationFn: () => createProduct(storeSlug, {
            ...form,
            price: parseFloat(form.price) || 0,
            discountPrice: form.discountPrice ? parseFloat(form.discountPrice) : null,
            categoryId: parseInt(form.categoryId, 10),
            sortOrder: 0,
        }),
        onSuccess: () => { setForm(emptyForm); invalidate() },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateProduct(storeSlug, id, data),
        onSuccess: invalidate,
    })

    const deleteMutation = useMutation({
        mutationFn: (id) => deleteProduct(storeSlug, id),
        onSuccess: invalidate,
    })

    const categoryName = (id) => categories?.find((c) => c.id === id)?.name ?? '—'

    return (
        <div>
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="font-bold text-sm mb-3">إضافة منتج جديد</div>
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <input placeholder="اسم المنتج" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm col-span-2" />
                    <input placeholder="الوزن/الحجم" value={form.unitLabel} onChange={(e) => setForm({ ...form, unitLabel: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm" />
                    <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm">
                        <option value="">اختر القسم</option>
                        {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input placeholder="السعر" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm" />
                    <input placeholder="سعر التخفيض (اختياري)" type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm" />
                    <input placeholder="رابط الصورة" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border border-gray-200 rounded-lg h-9 px-2 text-sm col-span-2" />
                </div>
                <button
                    onClick={() => addMutation.mutate()}
                    disabled={!form.name || !form.categoryId || addMutation.isPending}
                    className="h-9 px-4 rounded-lg bg-green-600 text-white font-bold text-sm"
                >
                    إضافة المنتج
                </button>
            </div>

            <div className="space-y-2">
                {products?.map((p) => (
                    <div key={p.id} className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 text-xs">
                        {p.image ? (
                            <img
                                src={p.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded bg-gray-100 shrink-0"
                                onError={(e) => { e.target.style.opacity = 0.2 }}
                            />
                        ) : (
                            <div className="w-12 h-12 rounded bg-gray-100 shrink-0 flex items-center justify-center text-gray-300 text-[9px]">
                                لا صورة
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="font-bold">{p.name}</div>
                            <div className="text-gray-400">{categoryName(p.categoryId)} · {p.unitLabel}</div>
                        </div>
                        <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => updateMutation.mutate({ id: p.id, data: { ...p, price: parseFloat(e.target.value) } })}
                            className="w-20 border border-gray-200 rounded-lg h-8 px-2"
                        />
                        <button onClick={() => deleteMutation.mutate(p.id)} className="text-red-500 font-bold px-2">
                            حذف
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductsTab