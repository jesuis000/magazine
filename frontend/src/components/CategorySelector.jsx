import CategorySlice from './CategorySlice'

function CategorySelector({ categories, activeCategoryId, onSelect }) {
    if (!categories || categories.length === 0) return null

    const singleCategory = categories.length === 1

    return (
        <div className="space-y-2 mt-4">
            {categories.map((cat, i) => (
                <CategorySlice
                    key={cat.id}
                    category={cat}
                    index={i}
                    isActive={singleCategory ? true : cat.id === activeCategoryId}
                    clickable={!singleCategory}
                    onClick={() => onSelect(cat.id)}
                />
            ))}
        </div>
    )
}

export default CategorySelector