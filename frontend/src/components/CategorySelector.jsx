import CategorySlice from './CategorySlice'

function CategorySelector({ categories, activeCategoryId, onSelect }) {
    if (!categories || categories.length === 0) return null

    return (
        <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-4 sm:gap-6 my-6 px-2">
            <CategorySlice
                category={{ id: 'all', name: 'الكل' }}
                isAll
                isActive={activeCategoryId === 'all'}
                onClick={() => onSelect('all')}
            />
            {categories.map((cat) => (
                <CategorySlice
                    key={cat.id}
                    category={cat}
                    isActive={cat.id === activeCategoryId}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
        </div>
    )
}

export default CategorySelector