import { LayoutGrid, Package } from 'lucide-react'

function CategorySlice({ category, isActive, onClick, isAll = false }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
        >
            <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all ${
                    isActive
                        ? 'ring-2 ring-[#0d4d43] shadow-md bg-[#0d4d43]/5'
                        : 'ring-1 ring-gray-200 bg-white group-hover:ring-gray-300'
                }`}
            >
                {isAll ? (
                    <LayoutGrid className="w-7 h-7 text-[#0d4d43]" strokeWidth={1.75} />
                ) : category.bannerImage ? (
                    <img
                        src={category.bannerImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                ) : (
                    <Package className="w-7 h-7 text-gray-400" strokeWidth={1.75} />
                )}
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-700 text-center max-w-[80px] leading-tight">
                {category.name}
            </span>
        </button>
    )
}

export default CategorySlice