const { useState, useEffect } = React;
const { NavLink } = ReactRouterDOM;

import { eventBusService } from "../services/event-bus.service.js";

export function AppHeader({ user, onSetUser, onLogout }) {
    const [currentUser, setCurrentUser] = useState(user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = eventBusService.on("user-updated", (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1 className="logo">BugSquash</h1>
                
                {/* כפתור המבורגר */}
                <button className="hamburger-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰
                </button>

                <nav className={`app-nav ${isMenuOpen ? "open" : ""}`}>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <NavLink to="/bug">Bugs</NavLink>
                    <NavLink to="/user">User</NavLink>
                </nav>
            </section>

            <nav className="sign-in-nav">
                {currentUser ? (
                    <button className="sign-in-btn" onClick={onLogout}>Logout</button>
                ) : (
                    <NavLink to="/login-signup" className="sign-in-btn">Sign In</NavLink>
                )}
            </nav>

            {user && (
                <div className="greet-user">Hello {user.fullname}</div>
            )}
        </header>
    );
}
