import { BugPreview } from "./BugPreview.jsx"
const { Link } = ReactRouterDOM

export function BugList({ bugs, onRemoveBug, user }) {
    return (
        <ul className="bug-list">
            {bugs.map(bug => {
                const isOwner = user && user._id && bug.owner && bug.owner._id && user._id === bug.owner._id
                const isAdmin = user && user.isAdmin

               

                return (
                    <li key={bug._id}>
                        <BugPreview bug={bug} />
                        <section>
                            {isOwner || isAdmin ? (
                                <React.Fragment>
                                    <button onClick={() => onRemoveBug(bug._id)}>Remove</button>
                                    <button><Link to={`/bug/edit/${bug._id}`}>Edit</Link></button>
                                </React.Fragment>
                            ) : (
                                <React.Fragment></React.Fragment>
                            )}
                            <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                        </section>
                    </li>
                )
            })}
        </ul>
    )
}
