import { bugService } from "../services/bug.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function BugEdit() {
    const [bugToEdit, setBugToEdit] = useState(bugService.getEmptyBug())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.bugId) loadBug()
    }, [])

    function loadBug() {
        bugService.getById(params.bugId)
            .then(setBugToEdit)
            .catch(err => console.log('Error loading bug:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
                value = +value || ''
                break
            default:
                break
        }

        setBugToEdit(prevBugToEdit => ({ ...prevBugToEdit, [field]: value }))
    }

    function onSaveBug(ev) {
        ev.preventDefault()
        bugService.save(bugToEdit)
            .then((savedBug) => {
                console.log('hi')
                navigate('/bug')
                showSuccessMsg(`Bug Saved (id: ${savedBug._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save bug')
                console.log('Error saving bug:', err)
            })
    }

    const { title, description, severity } = bugToEdit

    return (
        <section className="bug-edit">
            <form onSubmit={onSaveBug}>
                <label htmlFor="title">Title:</label>
                <input onChange={handleChange} value={title} type="text" name="title" id="title" />

                <label htmlFor="description">Description:</label>
                <textarea onChange={handleChange} value={description} name="description" id="description"></textarea>

                <label htmlFor="severity">Severity:</label>
                <input onChange={handleChange} value={severity} type="number" name="severity" id="severity" />

                <button>Save</button>
            </form>
        </section>
    )
}
