import {useEffect, useState} from 'react'

const AUTOPLAY_MS = 4000

function BannerCarousel({banners}) {
    const [index, setIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(true)

    const count = banners?.length ?? 0

    const goPrev = () => setIndex((i) => (i === 0 ? count - 1 : i - 1))
    const goNext = () => setIndex((i) => (i === count - 1 ? 0 : i + 1))

    // Autoplay: advances automatically, restarts whenever the slide
    // changes (manual or auto) or play/pause is toggled.
    useEffect(() => {
        if (!isPlaying || count <= 1) return

        const timer = setTimeout(() => {
            goNext()
        }, AUTOPLAY_MS)

        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, isPlaying, count])

    if (!banners || count === 0) {
        return null
    }

    const current = banners[index]
    const circumference = 2 * Math.PI * 9 // r=9

    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[3/1]">
            <img
                src={current.imageUrl}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
            />

            {count > 1 && (
                <>
                    <button
                        onClick={goPrev}
                        aria-label="Previous banner"
                        className="absolute top-1/2 -translate-y-1/2 left-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                    >
                        ‹
                    </button>
                    <button
                        onClick={goNext}
                        aria-label="Next banner"
                        className="absolute top-1/2 -translate-y-1/2 right-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                    >
                        ›
                    </button>

                    {/* Play/pause + autoplay progress ring, bottom-left, matches source design */}
                    <button
                        onClick={() => setIsPlaying((p) => !p)}
                        aria-label={isPlaying ? 'Pause autoplay' : 'Resume autoplay'}
                        className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" className="absolute -rotate-90">
                            <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
                            <circle
                                key={`${index}-${isPlaying}`}
                                cx="12" cy="12" r="9" fill="none" stroke="#fff" strokeWidth="2"
                                strokeDasharray={circumference}
                                strokeDashoffset={isPlaying ? 0 : circumference}
                                style={{
                                    strokeDashoffset: 0,
                                    animation: isPlaying ? `ring-progress ${AUTOPLAY_MS}ms linear forwards` : 'none',
                                }}
                            />
                        </svg>
                        {isPlaying ? (
                            <span className="flex gap-[2px]">
                <span className="w-[2px] h-[8px] bg-white"/>
                <span className="w-[2px] h-[8px] bg-white"/>
              </span>
                        ) : (
                            <span
                                className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-white ml-[1px]"
                            />
                        )}
                    </button>

                    {/* dot indicators */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {banners.map((_, i) => (
                            <span
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full ${
                                    i === index ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            <style>{`
        @keyframes ring-progress {
          from { stroke-dashoffset: ${circumference}; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
        </div>
    )
}

export default BannerCarousel