import React from 'react'

interface CategoryFilterBadgesProps {
    categories: string[]
    selectedCategory: string
    onSelectCategory: (category: string) => void
    onClearCategory: () => void
}

const CategoryFilterBadges: React.FC<CategoryFilterBadgesProps> = ({
    categories,
    selectedCategory,
    onSelectCategory,
    onClearCategory,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={onClearCategory}
                className={`px-3 py-1 cursor-pointer bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 hover:shadow-md transition ${
                    selectedCategory === ''
                        ? 'font-bold'
                        : 'bg-gray-200 text-gray-800 hover:font-bold'
                }`}
            >
                Toutes
            </button>
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-3 py-1 cursor-pointer bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-4 hover:shadow-md transition ${
                        selectedCategory === cat
                            ? 'font-bold'
                            : 'bg-gray-200 text-gray-800 hover:font-bold'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    )
}

export default CategoryFilterBadges
