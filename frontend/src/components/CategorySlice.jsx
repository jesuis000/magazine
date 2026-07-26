const FALLBACK_PALETTE = ['#e4a11b', '#17c3c3', '#a855f7', '#84cc16', '#f472b6', '#38bdf8']

function CategorySlice({ category, index, isActive, onClick, clickable }) {
    const bg = category.color || FALLBACK_PALETTE[index % FALLBACK_PALETTE.length]

    return (
        <button
            onClick={clickable ? onClick : undefined}
            disabled={!clickable}
            className={`relative w-full h-24 sm:h-28 md:h-32 rounded-lg overflow-hidden transition-all ${
                isActive ? 'opacity-100' : 'opacity-90 hover:opacity-100'
            } ${clickable ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ backgroundColor: bg }}
        >
            {category.bannerImage && (
                <img
                    src={category.bannerImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            )}

            {/* Gradient overlay: strong near the text (right, in RTL), fading toward the image */}
            <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to left, ${bg}ee 25%, ${bg}55 55%, transparent 100%)` }}
            />

            <div className="relative z-10 h-full flex items-center justify-between px-5">
        <span className="font-extrabold text-base md:text-xl text-white drop-shadow-sm">
          {category.name}
        </span>
                {clickable && (
                    <span className={`text-white text-lg transition-transform ${isActive ? 'rotate-90' : ''}`}>
            ‹
          </span>
                )}
            </div>

            {isActive && (
                <div className="absolute inset-0 ring-2 ring-white ring-inset rounded-lg pointer-events-none" />
            )}
        </button>
    )
}

export default CategorySlice