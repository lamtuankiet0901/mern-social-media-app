import "./message.css"
import { format } from 'timeago.js'
import { useState, useEffect } from "react"
import axios from "axios"

export default function Message({message ,own, currentUser}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (!currentUser?.profilePicture) {
            const getUser = async () => {
                try {
                    const res = await axios.get("/users?userId="+currentUser)
                    setUsers(res.data.user)
                } catch (error) {
                    console.log(error)
                }
            }
            getUser()
        } else {
            setUsers(currentUser)
        }
    },[currentUser])
    
    return (
        <div className={own ? "message own" : "message"}>
            <div className="messageTop">
                <img src={users?.profilePicture ? PF+users.profilePicture : PF+"person/noAvatar.png"} alt="" className="messageImg" />
                <p className="messageText">
                    {message.text}
                </p>
            </div>
            <div className="messageBottom">{format(message.createdAt)}</div>
        </div>
    )
}
