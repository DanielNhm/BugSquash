const { useState } = React
import { userService } from "../services/user.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"


export function LoginSignup({ onSetUser}) {
    const [isSignup, setIsSignup] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")

    const [loginForm, setLoginForm] = useState({
        username: "puki",
        password: "secret1"
    })
    const [signupForm, setSignupForm] = useState({
        fullname: "",
        username: "",
        password: ""
    })

    function handleChange(ev, formType) {
        const { name, value } = ev.target
        if (formType === "login") {
            setLoginForm(prev => ({ ...prev, [name]: value }))
        } else {
            setSignupForm(prev => ({ ...prev, [name]: value }))
        }
    }

    function handleLogin(ev) {
        ev.preventDefault()
        setIsLoading(true)
        setMessage("")

        userService.login(loginForm)
            .then(user => {
                console.log(user)
                if (user) {  
                    onSetUser(user)  
                    setMessage("Login successful ✅")
                    showSuccessMsg("Login successful")
                } else {
                    setMessage("Login failed. Please check your credentials.")
                    showErrorMsg("Login failed")
                }
            })
            .catch(err => {
                console.error("Login error:", err)
                setMessage("Login failed. Please try again.")
                showErrorMsg("Login failed")
            })
            .finally(() => setIsLoading(false))
    }

    function handleSignup(ev) {
        ev.preventDefault()
        setIsLoading(true)
        setMessage("")

        userService.signup(signupForm)
            .then(user => {
                if (user && user.username) {  
                    onSetUser(user)  // Emit the updated user across the app
                    setMessage("Signup successful ✅")
                    showSuccessMsg("Signup successful")
                } else {
                    setMessage("Signup failed. Please try again.")
                    showErrorMsg("Signup failed")
                }
            })
            .catch(err => {
                console.error("Signup error:", err)
                setMessage("Signup failed. Please try again.")
                showErrorMsg("Signup failed")
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <section className="login-signup">
            {message && <div className={`message ${message.includes("failed") ? "error" : "success"}`}>{message}</div>}

            {isSignup ? (
                <form onSubmit={handleSignup}>
                    <h2>Signup</h2>
                    <input type="text" name="fullname" value={signupForm.fullname} placeholder="Full name" onChange={ev => handleChange(ev, "signup")} />
                    <input type="text" name="username" value={signupForm.username} placeholder="Username" onChange={ev => handleChange(ev, "signup")} />
                    <input type="password" name="password" value={signupForm.password} placeholder="Password" onChange={ev => handleChange(ev, "signup")} />
                    <button disabled={isLoading}>{isLoading ? "Signing up..." : "Signup"}</button>
                </form>
            ) : (
                <form onSubmit={handleLogin}>
                    <h2>Login</h2>
                    <input type="text" name="username" value={loginForm.username} placeholder="Username" onChange={ev => handleChange(ev, "login")} />
                    <input type="password" name="password" value={loginForm.password} placeholder="Password" onChange={ev => handleChange(ev, "login")} />
                    <button disabled={isLoading}>{isLoading ? "Logging in..." : "Login"}</button>
                </form>
            )}

            <hr />
            <div className="btns">
                <button className="signin-signup-btn" type="button" onClick={() => setIsSignup(prev => !prev)}>
                    {isSignup ? "Already a member? Login" : "New user? Signup here"}
                </button>
            </div>
        </section>
    )
}
