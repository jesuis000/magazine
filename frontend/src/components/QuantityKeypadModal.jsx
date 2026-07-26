import { useState } from 'react'

function QuantityKeypadModal({ product, initialQty, onConfirm, onClose }) {
    const [value, setValue] = useState(String(initialQty || ''))

    const pressKey = (k) => setValue((v) => (v + k).replace(/^0+(?=\d)/, ''))
    const backspace = () => setValue((v) => v.slice(0, -1))

    const confirm = () => {
        onConfirm(parseInt(value || '0', 10))
        onClose()
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-end justify-center z-50"
            onClick={onClose}
        >
            <div
                dir="rtl"
                className="bg-white w-full max-w-md rounded-t-2xl p-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center font-bold text-lg">
                    <span>{product.unitLabel}</span>
                    <span>{value || 0}</span>
                </div>
                <div className="text-center text-green-700 font-extrabold my-3">
                    {product.name}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                    {['1','2','3','4','5','6','7','8','9'].map((n) => (
                        <button
                            key={n}
                            onClick={() => pressKey(n)}
                            className="h-12 rounded-lg bg-gray-100 font-bold text-lg"
                        >
                            {n}
                        </button>
                    ))}
                    <button onClick={backspace} className="h-12 rounded-lg bg-yellow-400 font-bold">⌫</button>
                    <button onClick={() => pressKey('0')} className="h-12 rounded-lg bg-gray-100 font-bold text-lg">0</button>
                    <button onClick={onClose} className="h-12 rounded-lg bg-red-500 text-white font-bold">غلق</button>
                </div>

                <button onClick={confirm} className="w-full h-12 rounded-lg bg-green-600 text-white font-bold">
                    موافق
                </button>
            </div>
        </div>
    )
}

export default QuantityKeypadModal