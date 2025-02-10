const { useState } = React

export function BugFilter({ onSetFilter }) {
    const [filter, setFilter] = useState({ title: '', minSeverity: 1, labels: '' })

    function handleChange({ target }) {
        const { name, value } = target
        const updatedFilter = { ...filter, [name]: name === 'minSeverity' ? +value : value }
        setFilter(updatedFilter)
        onSetFilter(updatedFilter)
    }

    return (
        <div className="bug-filter">
            <label htmlFor="title">Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={filter.title}
                onChange={handleChange}
            />
            <label htmlFor="minSeverity">Min Severity:</label>
            <input
                type="number"
                id="minSeverity"
                name="minSeverity"
                min="1"
                max="3"
                value={filter.minSeverity}
                onChange={handleChange}
            />
            <label htmlFor="labels">Labels:</label>
            <input
                type="text"
                id="labels"
                name="labels"
                value={filter.labels}
                onChange={handleChange}
            />
        </div>
    )
}
