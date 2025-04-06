import React from 'react'

interface TitleFilterBadgesProps {
    titles: string[]
    selectedTitle: string
    onSelectTitle: (title: string) => void
    onClearFilter: () => void
}

const TitleFilterBadges: React.FC<TitleFilterBadgesProps> = ({
    titles,
    selectedTitle,
    onSelectTitle,
    onClearFilter,
}) => {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={onClearFilter}
                className={`px-3 py-1 rounded transition ${
                    selectedTitle === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800 hover:bg-blue-500'
                }`}
            >
                Tous
            </button>
            {titles.map((title) => (
                <button
                    key={title}
                    onClick={() => onSelectTitle(title)}
                    className={`px-3 py-1 rounded transition ${
                        selectedTitle === title
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-blue-500'
                    }`}
                >
                    {title}
                </button>
            ))}
        </div>
    )
}

export default TitleFilterBadges
