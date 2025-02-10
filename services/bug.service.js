import fs from 'fs'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 2
const bugs = utilService.readJsonFile('data/bugs.json')

function query(criteria = { title: '', minSeverity: '', labels: '', sortBy: '', direction: true, pageIdx: 0 }) {
    let filteredBugs = [...bugs]

    // Filter by labels
    if (criteria.labels) {
        filteredBugs = filterByLabels(filteredBugs, criteria.labels)
    }

    // Filter by title
    if (criteria.title) {
        filteredBugs = filterByTitle(filteredBugs, criteria.title)
    }

    // Filter by minSeverity
    if (criteria.minSeverity) {
        filteredBugs = filterByMinSeverity(filteredBugs, +criteria.minSeverity)
    }

    // Sort by field
    if (criteria.sortBy) {
        filteredBugs = sortByField(filteredBugs, criteria.sortBy, criteria.direction)
    }

    // Paginate the bugs
    const maxPageIdx = Math.ceil(filteredBugs.length / PAGE_SIZE) - 1
    if (criteria.pageIdx !== undefined) {
        filteredBugs = paginate(filteredBugs, criteria.pageIdx, maxPageIdx)
    }

    return Promise.resolve({ bugs: filteredBugs, maxPage: maxPageIdx })
}

function filterByLabels(bugs, labels) {
    return bugs.filter(bug => bug.labels && bug.labels.some(label => label.toLowerCase().includes(labels.toLowerCase())))
}

function filterByTitle(bugs, title) {
    return bugs.filter(bug => bug.title.toLowerCase().includes(title.toLowerCase()))
}

function filterByMinSeverity(bugs, minSeverity) {
    return bugs.filter(bug => bug.severity >= minSeverity)
}

function sortByField(bugs, sortBy, direction) {
    const dir = direction ? 1 : -1
    return bugs.sort((a, b) => {
        if (sortBy === 'createdAt') {
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            return (dateA - dateB) * dir
        } else if (sortBy === 'severity') {
            return (a.severity - b.severity) * dir
        } else if (sortBy === 'title') {
            return a.title.localeCompare(b.title) * dir
        }
        return 0
    })
}

function paginate(bugs, pageIdx, maxPageIdx) {
    if (pageIdx < 0 || pageIdx > maxPageIdx) return []
    const startIdx = pageIdx * PAGE_SIZE
    return bugs.slice(startIdx, startIdx + PAGE_SIZE)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('Bug not found')

    const bug = bugs[bugIdx]

    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')

    bugs.splice(bugIdx, 1)
    return _saveBugsToFile().then(() => bugs)
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const idx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (idx === -1) return Promise.reject('Bug not found')
        if (!loggedinUser.isAdmin
            && bugs[idx].owner._id !== loggedinUser._id) return Promise.reject('Not your bug')

        bugs[idx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.owner = loggedinUser
        bug.createdAt = Date.now()
        bugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bugs.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}
