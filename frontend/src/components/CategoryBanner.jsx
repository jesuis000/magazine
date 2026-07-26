function CategoryBanner({ category }) {
    return (
        <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-[3/1] flex items-center justify-center">
            {category.bannerImage && (
                <img
                    src={category.bannerImage}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
            )}
            <span className="relative z-10 text-white text-2xl md:text-3xl font-extrabold">
        {category.name}
      </span>
        </div>
    )
}

export default CategoryBanner