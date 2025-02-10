const Router = ReactRouterDOM.HashRouter
const { Routes, Route } = ReactRouterDOM

const { useState, useEffect } = React

import { AppHeader } from "./cmps/AppHeader.jsx"
import { Home } from "./pages/Home.jsx"
import { About } from "./pages/About.jsx"
import { BugIndex } from "./pages/BugIndex.jsx"
import { BugDetails } from "./pages/BugDetails.jsx"
import { BugEdit } from "./pages/BugEdit.jsx"
import { UserDetails } from "./pages/UserDetails.jsx"
import { LoginSignup } from "./cmps/LoginSignup.jsx"
import { userService } from "./services/user.service.js"
import { eventBusService } from './services/event-bus.service.js'

export function RootCmp() {
    const [user, setUser] = useState(userService.getLoggedinUser())

    useEffect(() => {
        const unsubscribe = eventBusService.on('logout', () => {
            onLogout()
        })
        return () => unsubscribe()
    }, [])

    function onSetUser(loggedInUser) {
        setUser(loggedInUser)
        eventBusService.emit('user-updated', loggedInUser)
    }

    function onLogout() {
        userService.logout()
        setUser(null)
        eventBusService.emit('user-updated', null)
        eventBusService.emit('reload-user')
    }

    return (
        <Router>
            <section className="app main-layout">
                <AppHeader user={user} onSetUser={onSetUser} onLogout={onLogout} />
                <main>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/user" element={<UserDetails />} />
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                        <Route path="/bug" element={<BugIndex onSetUser={onSetUser} />} />
                        <Route path="/bug/edit/:bugId" element={<BugEdit />} />
                        <Route path="/bug/edit" element={<BugEdit />} />
                        <Route path="/login-signup" element={<LoginSignup onSetUser={onSetUser} />} />
                    </Routes>
                </main>
            </section>
        </Router>
    )
}
