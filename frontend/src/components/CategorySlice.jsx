import { LayoutGrid, Package } from 'lucide-react'

function CategorySlice({ category, isActive, onClick, isAll = false }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-1.5 cursor-pointer group focus:outline-none transition-transform active:scale-95"
        >
            {/* Circular Frame with Active Ring & Subtle Pop */}
            <div
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center overflow-hidden transition-all duration-200 ${
                    isActive
                        ? 'ring-2 ring-[#00764D] ring-offset-2 shadow-md bg-[#00764D]/5 scale-105'
                        : 'ring-1 ring-gray-200 bg-white group-hover:ring-gray-300 group-hover:shadow-sm'
                }`}
            >
                {isAll ? (
                    <LayoutGrid
                        className={`w-7 h-7 transition-colors ${isActive ? 'text-[#00764D]' : 'text-gray-600'}`}
                        strokeWidth={1.75}
                    />
                ) : category.bannerImage ? (
                    <img
                        src={category.bannerImage}
                        alt={category.name || ''}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                ) : (
                    <Package
                        className={`w-7 h-7 transition-colors ${isActive ? 'text-[#00764D]' : 'text-gray-400'}`}
                        strokeWidth={1.75}
                    />
                )}
            </div>

            {/* Label with Matching Dynamic Active Text Styling */}
            <span
                className={`text-xs sm:text-sm text-center max-w-[80px] leading-tight transition-colors ${
                    isActive
                        ? 'font-extrabold text-[#00764D]'
                        : 'font-bold text-gray-700 group-hover:text-gray-900'
                }`}
            >
                {category.name}
            </span>
        </button>
    )
}

export default CategorySlice