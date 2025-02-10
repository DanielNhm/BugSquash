const { useState, useEffect } = React
const { Link } = ReactRouterDOM

import { BugList } from "../cmps/BugList.jsx"
import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg, eventBusService } from "../services/event-bus.service.js"
import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugSort } from "../cmps/BugSort.jsx"
import { userService } from "../services/user.service.js"

export function BugIndex({ onSetUser }) {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState({ title: '', minSeverity: 1, labels: '', pageIdx: 0 })
    const [sortBy, setSortBy] = useState({ sortBy: '', direction: true })
    const [maxPage, setMaxPage] = useState(null)
    const [user, setUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        loadBugs()
    }, [filterBy, sortBy])

    useEffect(() => {
        const loggedInUser = userService.getLoggedinUser()
        setUser(loggedInUser)
    }, [])

    useEffect(() => {
        if (user) {
            onSetUser(user)
        }
    }, [user])

    useEffect(() => {
        const unsubscribe = eventBusService.on('reload-user', () => {
            setUser(null)
        })
        return () => unsubscribe()
    }, [])

    function loadBugs() {
        const criteria = { ...filterBy, ...sortBy }
        console.log('hi')
        bugService
            .query(criteria)
            .then(({ bugs, maxPage }) => {
                setBugs(bugs)
                setMaxPage(maxPage)
            })
            .catch((err) => {
                console.error('Failed to load bugs:', err)
                showErrorMsg('Cannot load bugs')
            })
    }

    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                setBugs((prevBugs) => prevBugs.filter((bug) => bug._id !== bugId))
                loadBugs()
                showSuccessMsg(`Bug removed`)
            })
            .catch((err) => {
                console.error('err:', err)
                showErrorMsg('Cannot remove bug ' + bugId)
            })
    }

    function onDownloadPDF() {
        bugService.downloadPDF()
            .then(() => showSuccessMsg('PDF downloaded'))
            .catch((err) => {
                console.error('Failed to download PDF:', err)
                showErrorMsg('Cannot download PDF')
            })
    }

    function onSetFilter(newFilter) {
        setFilterBy((prev) => ({ ...prev, ...newFilter, pageIdx: 0 }))
    }

    function onSetSort(newSort) {
        setSortBy(newSort)
    }

    function onChangePageIdx(diff) {
        const nextPageIdx = filterBy.pageIdx + diff
        if (nextPageIdx < 0 || nextPageIdx >= maxPage + 1) return
        setFilterBy((prevFilterBy) => ({ ...prevFilterBy, pageIdx: nextPageIdx }))
    }

    if (!bugs) return <div>Loading...</div>

    return (
        <section className="bug-index">
            <React.Fragment>

                <div className="filters-sort">
                    <BugFilter onSetFilter={onSetFilter} />
                    <BugSort onSetSort={onSetSort} />
                </div>
                <div>
                    {user && <Link to="/bug/edit" className="add-bug-link">Add Bug</Link>}
                    <button className="pdf-btn" onClick={onDownloadPDF}>PDF</button>
                </div>
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} user={user} />
                <section className="pagination">
                    <button disabled={filterBy.pageIdx === 0} onClick={() => onChangePageIdx(-1)}>
                        Prev
                    </button>
                    <button disabled={filterBy.pageIdx === maxPage} onClick={() => onChangePageIdx(1)}>
                        Next
                    </button>
                    <span>Page {filterBy.pageIdx + 1} of {maxPage + 1}</span>
                </section>
            </React.Fragment>
        </section>
    )
}
