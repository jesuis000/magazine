import { useCartStore } from '../store/cartStore'

function OrderButton({ onClick }) {
    const items = useCartStore((s) => s.items)
    const itemList = Object.values(items)

    if (itemList.length === 0) return null

    const totalQty = itemList.reduce((sum, i) => sum + i.qty, 0)

    return (
        <button
            onClick={onClick}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-blue-600 text-white font-bold rounded-full px-6 h-12 shadow-lg flex items-center gap-2"
        >
            🛒 اوردر
            <span className="bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold">
        {totalQty}
      </span>
        </button>
    )
}

export default OrderButton