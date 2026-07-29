import { useCartStore } from '../store/cartStore'
import {ShoppingCart} from 'lucide-react';

function OrderButton({ onClick }) {
    const items = useCartStore((s) => s.items)
    const itemList = Object.values(items)

    if (itemList.length === 0) return null

    const totalQty = itemList.reduce((sum, i) => sum + i.qty, 0)

    return (
        <button
            onClick={onClick}
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#00764D] hover:bg-[#006643] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 active:scale-95"
        >
            <ShoppingCart className="w-5 h-5" />
            <span>عرض السلة</span>
            <span className="bg-white text-[#00764D] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center mr-1">
        {totalQty}
    </span>
        </button>
    )
}

export default OrderButton