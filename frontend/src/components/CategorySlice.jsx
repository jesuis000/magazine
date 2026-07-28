const FALLBACK_PALETTE = ['#e4a11b', '#17c3c3', '#a855f7', '#84cc16', '#f472b6', '#38bdf8']
const ACTIVE_COLOR = '#16a34a' // green highlight for the selected category

function CategorySlice({ category, index, isActive, onClick, clickable }) {
    const tint = category.color || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]

    return (
        <button
            onClick={clickable ? onClick : undefined}
            disabled={!clickable}
            className={`flex flex-col items-center justify-center gap-1.5 shrink-0 w-20 sm:w-24 py-3 rounded-2xl border transition-all ${
                isActive
                    ? 'text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
            } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
            style={isActive ? { backgroundColor: ACTIVE_COLOR, borderColor: ACTIVE_COLOR } : undefined}
        >
            <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : `${tint}22` }}
            >
                {category.bannerImage ? (
                    <img
                        src={category.bannerImage}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                ) : (
                    <span className="text-lg font-extrabold" style={{ color: isActive ? '#fff' : tint }}>
                        {category.name?.charAt(0)}
                    </span>
                )}
            </div>

            <span className="text-[11px] sm:text-xs font-bold text-center leading-tight px-1">
                {category.name}
            </span>
        </button>
    )
}

export default CategorySlice