import CategorySlice from './CategorySlice'

function CategorySelector({ categories, activeCategoryId, onSelect }) {
    if (!categories || categories.length === 0) return null

    return (
        <div className="flex flex-row-reverse flex-wrap justify-center gap-4 sm:gap-6 mt-4 mb-6">
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