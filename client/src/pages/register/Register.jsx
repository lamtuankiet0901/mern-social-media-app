import axios from "axios"
import { useRef } from "react"
import { useHistory, Link } from "react-router-dom"
import "./register.css"

export default function Register() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const history = useHistory()

    const handleClick = async (e) => {
        e.preventDefault();
        if (passwordAgain.current.value !== password.current.value){
            passwordAgain.current.setCustomValidity("Password don't match");
        } else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }
            try {
                await axios.post("/auth/register", user)
                alert("Your account has been created.")
                history.push("/login")
            } catch (error) {
                console.log(error)
            }
        }
    }


    return (
        <div className="login">
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">Tunkit</h3>
                    <span className="loginDesc">
                        Connect with friends and the world around you on Tunkit
                    </span>
                </div>
                <div className="loginRight">
                    <form className="loginBox" onSubmit={handleClick}>
                        <input placeholder="Username" ref={username} required className="loginInput" />
                        <input type="email" placeholder="Email" ref={email} required className="loginInput" />
                        <input type="password" minLength="6" placeholder="Password" ref={password} required className="loginInput" />
                        <input type="password" placeholder="Password Again" ref={passwordAgain} required className="loginInput" />
                        <button className="loginButton" type="submit">Sign Up</button>
                        <Link to="/login" style={{width:"70%", alignSelf:"center"}}>
                        <button className="loginRegisterButton">Log into Account</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
