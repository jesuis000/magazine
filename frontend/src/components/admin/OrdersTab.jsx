import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchOrders, fetchOrderDetail, updateOrderStatus } from '../../api/orders'

const STATUS_LABELS = {
    PENDING: 'قيد الانتظار', CONFIRMED: 'مؤكد', PREPARING: 'جاري التجهيز',
    OUT_FOR_DELIVERY: 'خرج للتوصيل', DELIVERED: 'تم التسليم', CANCELLED: 'ملغي',
}
const STATUS_COLORS = {
    PENDING: 'bg-gray-100 text-gray-600', CONFIRMED: 'bg-blue-100 text-blue-700',
    PREPARING: 'bg-yellow-100 text-yellow-700', OUT_FOR_DELIVERY: 'bg-purple-100 text-purple-700',
    DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
}

function OrdersTab({ storeSlug }) {
    const queryClient = useQueryClient()
    const { data: orders } = useQuery({ queryKey: ['orders', storeSlug], queryFn: () => fetchOrders(storeSlug) })
    const [expandedId, setExpandedId] = useState(null)

    const { data: detail } = useQuery({
        queryKey: ['order-detail', storeSlug, expandedId],
        queryFn: () => fetchOrderDetail(storeSlug, expandedId),
        enabled: !!expandedId,
    })

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => updateOrderStatus(storeSlug, id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders', storeSlug] }),
    })

    if (!orders?.length) {
        return <p className="text-gray-400 text-sm py-6 text-center">لا توجد طلبات بعد</p>
    }

    return (
        <div className="space-y-2">
            {orders.map((o) => (
                <div key={o.id} className="border border-gray-200 rounded-lg p-3">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                    >
                        <div>
                            <div className="font-bold text-sm">طلب #{o.id}</div>
                            <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString('ar-EG')}</div>
                        </div>
                        <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-1 rounded ${STATUS_COLORS[o.status]}`}>
                {STATUS_LABELS[o.status]}
              </span>
                            <span className="font-bold text-sm">{o.netTotal} جم</span>
                        </div>
                    </div>

                    {expandedId === o.id && detail && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                            <div className="text-xs text-gray-500 mb-2">
                                العميل: {detail.customer?.name} · {detail.customer?.phone} · {detail.customer?.address}
                            </div>

                            <table className="w-full text-xs mb-3">
                                <tbody>
                                {detail.items?.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50">
                                        <td className="py-1.5">{item.productName}</td>
                                        <td className="py-1.5 text-center">×{item.qty}</td>
                                        <td className="py-1.5 text-left">{item.lineTotal} جم</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold">تحديث الحالة:</label>
                                <select
                                    value={o.status}
                                    onChange={(e) => statusMutation.mutate({ id: o.id, status: e.target.value })}
                                    className="border border-gray-200 rounded-lg h-8 px-2 text-xs"
                                >
                                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default OrdersTab