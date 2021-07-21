import axios from "axios"
import { useEffect, useState } from "react"
import "./chatonline.css"

export default function ChatOnline({onlineUsers, currentId, setCurrentChat}) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    const [friends, setFriends] = useState([])
    const [onlineFriends, setOnlineFriends] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            try {
                const res = await axios.get("/users/friends/"+currentId)
                setFriends(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        getFriends();
    },[currentId])

    useEffect(() => {
        setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)))
    },[friends, onlineUsers])

    const handleClick = async (user) => {
        try {
            const res = await axios.get(`/conversations/find/${currentId}/${user._id}`)
            if (res.data===null) {
                const newConv = {
                    senderId: currentId,
                    receiverId: user._id,
                }
                try {
                    const Conv = await axios.post(`/conversations`, newConv)
                    setCurrentChat(Conv.data)
                } catch (error) {
                    console.log(error)
                }
            } else {
                setCurrentChat(res.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="chatOnline">
            {onlineFriends.map((online) => (
                <div className="chatOnlineFriend" onClick={() => handleClick(online)}>
                    <div className="chatOnlineImgContainer">
                        <img src={online?.profilePicture ? PF+online.profilePicture : PF+"person/noAvatar.png"} alt="" className="chatOnlineImg" />
                        <div className="chatOnlineBadge"></div>
                    </div>
                    <span className="chatOnlineName">{online?.username}</span>
                </div>
            ))}
        </div>
    )
}
