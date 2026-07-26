import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchCustomers, fetchCustomerDetail } from '../../api/customers'

function CustomersTab({ storeSlug }) {
    const { data: customers } = useQuery({ queryKey: ['customers', storeSlug], queryFn: () => fetchCustomers(storeSlug) })
    const [expandedId, setExpandedId] = useState(null)

    const { data: detail } = useQuery({
        queryKey: ['customer-detail', storeSlug, expandedId],
        queryFn: () => fetchCustomerDetail(storeSlug, expandedId),
        enabled: !!expandedId,
    })

    if (!customers?.length) {
        return <p className="text-gray-400 text-sm py-6 text-center">لا يوجد عملاء بعد</p>
    }

    return (
        <div className="space-y-2">
            {customers.map((c) => (
                <div key={c.id} className="border border-gray-200 rounded-lg p-3">
                    <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    >
                        <div>
                            <div className="font-bold text-sm">{c.name || 'بدون اسم'}</div>
                            <div className="text-xs text-gray-400" dir="ltr">{c.phone}</div>
                        </div>
                        <div className="text-xs text-gray-400">{c.area}</div>
                    </div>

                    {expandedId === c.id && detail && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs">
                            <div className="text-gray-500 mb-2">{detail.customer.address}</div>
                            <div className="font-bold mb-1">الطلبات ({detail.orders.length})</div>
                            {detail.orders.map((o) => (
                                <div key={o.id} className="flex justify-between py-1 border-b border-gray-50">
                                    <span>طلب #{o.id}</span>
                                    <span>{o.netTotal} جم</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default CustomersTab