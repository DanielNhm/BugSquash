'use strict'

import axios from "../lib/axios"

export const bugService = {
    query,
    getById,
    remove,
    save,
    getEmptyBug,
    downloadPDF
}

const BASE_URL = 'http://localhost:3031/api/bug/'

function query(criteria = { title: '', minSeverity: 1, sortBy: '', direction: true, pageIdx: 0 }) {
    const params = { ...criteria }
    if (!params.title) delete params.title
    if (!params.sortBy) delete params.sortBy

    return axios.get(BASE_URL, { params }).then((res) => res.data)
}

function getById(bugId) {
    return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getEmptyBug(title = '', description = '', severity = '') {
    return { title, description, severity }
}

function downloadPDF() {
    return axios.get('api/download', { responseType: 'blob' }).then((res) => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'bugs_report.pdf')
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
    })
}
