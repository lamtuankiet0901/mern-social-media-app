import { useContext, useRef } from "react"
import "./login.css"
import { loginCall } from '../../apiCalls'
import { AuthContext } from "../../context/AuthContext"
import { CircularProgress } from '@material-ui/core'
import { Link } from 'react-router-dom'

export default function Login() {

    const email = useRef()
    const password = useRef()
    const { user, isFetching, dispatch } = useContext(AuthContext)

    const handleClick = (e) => {
        e.preventDefault()
        loginCall({email:email.current.value ,password: password.current.value}, dispatch)
    }

    console.log(user)

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
                        <input placeholder="Email" type="email" className="loginInput" required ref={email} />
                        <input placeholder="Password" type="password" className="loginInput" required ref={password} minLength="6" />
                        <button className="loginButton" disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="25px" /> : "Log In"}</button>
                        <span className="loginForgot">Forgot Password?</span>
                        <Link to="/register" style={{width:"70%", alignSelf:"center"}}>
                        <button className="loginRegisterButton">{isFetching ? <CircularProgress color="white" size="25px" /> : "Create a New Account"}</button>
                        </Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
