const { useState } = React

export function BugSort({ onSetSort }) {
    const [sort, setSort] = useState({ sortBy: '', direction: true })

    function handleSortChange({ target }) {
        const updatedSort = { ...sort, sortBy: target.value }
        setSort(updatedSort)
        onSetSort(updatedSort)
    }

    function toggleDirection() {
        const updatedSort = { ...sort, direction: !sort.direction }
        setSort(updatedSort)
        onSetSort(updatedSort)
    }

    return (
        <div className="bug-sort">
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sort.sortBy} onChange={handleSortChange}>
                <option value="">--Please choose an option--</option>
                <option value="title">Title</option>
                <option value="severity">Severity</option>
                <option value="createdAt">Created At</option>
            </select>
            <button onClick={toggleDirection}>
                {sort.direction ? 'ASC' : 'DESC'}
            </button>
        </div>
    )
}
