import { bugService } from "../services/bug.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [params.bugId])
    console.log(bug)

    function loadBug() {
        bugService.getById(params.bugId)
            .then(setBug)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load bug')
                navigate('/bug')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/bug')
        // navigate(-1)
    }

    if (!bug) return <div>Loading...</div>
    return (
        <section className="bug-details">
            <h1>{bug.title}</h1>
            <h2>severity:{bug.severity}</h2>
            <p>{bug.description}</p>
            <button onClick={onBack}>Back</button>

        </section>
    )
}