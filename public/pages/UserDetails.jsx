const { useState, useEffect } = React;

import { userService } from "../services/user.service.js"
import { bugService } from "../services/bug.service.js"
import { eventBusService } from "../services/event-bus.service.js"


export function UserDetails() {
    const [user, setUser] = useState(null)
    const [bugs, setBugs] = useState([])

    useEffect(() => {
        const loggedInUser = userService.getLoggedinUser()
        setUser(loggedInUser)
        if (loggedInUser) {
            bugService.query().then(({bugs}) => {
                const userBugs = bugs.filter(bug => bug.owner._id=== loggedInUser._id)
                setBugs(userBugs)
            })
        }
    }, [])

    function onLogOut() {
        userService.logout()
        setUser(null)
        setBugs([])
        eventBusService.emit('logout')
    }

    return (
        <section className="user-details">
            {user ? (
                <div className="user-info">
                    <h2>Hello, {user.fullname}</h2>
                    <p><strong>Full name:</strong> {user.fullname}</p>
                    <p><strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}</p>
                    <h3>Managed Bugs</h3>
                    {bugs.length ? (
                        <ul className="bug-list">
                            {bugs.map((bug) => (
                                <li key={bug._id} className="bug-item">
                                    <strong>{bug.title}</strong> - Severity: {bug.severity}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No bugs managed</p>
                    )}
                    <button onClick={onLogOut} className="logout-btn">Logout</button>
                </div>
            ) : (
                <div className="sign-in">Please sign in</div>
            )}
        </section>
    )
}